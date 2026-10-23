import { render } from '@testing-library/react-native';

import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders its label', async () => {
    const { getByText } = await render(<Badge label="Aktif" tone="success" />);
    expect(getByText('Aktif')).toBeTruthy();
  });
});
