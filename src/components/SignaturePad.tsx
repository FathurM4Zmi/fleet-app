import { forwardRef, useCallback, useId, useImperativeHandle, useRef, useState } from 'react';
import { PanResponder, Platform, StyleSheet, View, type GestureResponderEvent } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

export interface SignaturePadHandle {
  clear: () => void;
  isEmpty: () => boolean;
  /** Returns a base64 PNG (without the `data:` prefix) or null when unavailable. */
  toDataURL: () => Promise<string | null>;
}

interface SignaturePadProps {
  height?: number;
  onChange?: (hasInk: boolean) => void;
}

const STROKE_COLOR = '#111827';
const STROKE_WIDTH = 3;

/**
 * FRD-MOB-POD-01 — canvas tanda tangan penerima.
 *
 * Draws with `react-native-svg` so the same component works in Expo Go and on
 * web. The SVG view is rasterised to PNG with `Svg.toDataURL`, then uploaded
 * like any other evidence photo.
 */
export const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(
  function SignaturePad({ height = 160, onChange }, ref) {
    const svgRef = useRef<Svg>(null);
    const webId = `signature-${useId().replace(/:/g, '')}`;
    const [paths, setPaths] = useState<string[]>([]);
    const pathsRef = useRef<string[]>([]);
    const drawing = useRef(false);
    const lastPoint = useRef<{ x: number; y: number } | null>(null);

    const commit = useCallback(
      (next: string[]) => {
        pathsRef.current = next;
        setPaths(next);
        onChange?.(next.length > 0);
      },
      [onChange],
    );

    const pointOf = (event: GestureResponderEvent) => {
      const { locationX, locationY } = event.nativeEvent;
      return { x: Math.max(0, locationX), y: Math.max(0, locationY) };
    };

    const responder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (event) => {
          drawing.current = true;
          const point = pointOf(event);
          lastPoint.current = point;
          commit([...pathsRef.current, `M ${point.x} ${point.y}`]);
        },
        onPanResponderMove: (event) => {
          if (!drawing.current) return;
          const point = pointOf(event);
          const previous = lastPoint.current;
          if (!previous) return;
          if (Math.hypot(point.x - previous.x, point.y - previous.y) < 1.5) return;
          lastPoint.current = point;
          const next = [...pathsRef.current];
          const last = next[next.length - 1];
          if (!last) return;
          next[next.length - 1] = `${last} L ${point.x} ${point.y}`;
          commit(next);
        },
        onPanResponderRelease: () => {
          drawing.current = false;
          lastPoint.current = null;
        },
        onPanResponderTerminate: () => {
          drawing.current = false;
          lastPoint.current = null;
        },
      }),
    ).current;

    useImperativeHandle(
      ref,
      () => ({
        clear: () => commit([]),
        isEmpty: () => pathsRef.current.length === 0,
        toDataURL: () => {
          if (Platform.OS === 'web') return webPng(webId, height);
          return new Promise<string | null>((resolve) => {
            const node = svgRef.current;
            if (!node) {
              resolve(null);
              return;
            }
            try {
              node.toDataURL((base64) => resolve(base64 || null), {
                width: 640,
                height: Math.round((640 * height) / 320),
              });
            } catch {
              resolve(null);
            }
          });
        },
      }),
      [commit, height, webId],
    );

    return (
      <View style={[styles.canvas, { height }]} {...responder.panHandlers}>
        <Svg id={webId} ref={svgRef} width="100%" height="100%">
          <Rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" />
          {paths.map((path, index) => (
            <Path
              key={`${index}-${path.length}`}
              d={path}
              stroke={STROKE_COLOR}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
        </Svg>
        {paths.length === 0 ? (
          <View pointerEvents="none" style={styles.hint}>
            <Text variant="caption" color="textMuted">
              Tanda tangan penerima di sini
            </Text>
          </View>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  canvas: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  hint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
});

/**
 * `Svg.toDataURL` is backed by a native module. On web we serialise the rendered
 * `<svg>` and paint it into a canvas so the same upload path can be reused.
 */
function webPng(id: string, height: number): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(null);
      return;
    }
    const source = document.getElementById(id) as SVGSVGElement | null;
    if (!source) {
      resolve(null);
      return;
    }
    const width = 640;
    const pixelHeight = Math.round((width * height) / 320);
    const clone = source.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', String(width));
    clone.setAttribute('height', String(pixelHeight));

    const xml = new XMLSerializer().serializeToString(clone);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = pixelHeight;
      const context = canvas.getContext('2d');
      if (!context) {
        resolve(null);
        return;
      }
      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, width, pixelHeight);
      context.drawImage(image, 0, 0, width, pixelHeight);
      resolve(canvas.toDataURL('image/png').split(',')[1] ?? null);
    };
    image.onerror = () => resolve(null);
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
  });
}
