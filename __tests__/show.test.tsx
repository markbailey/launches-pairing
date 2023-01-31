import show, { mount } from '../utilities/show';

const Component = () => <div>Test Component</div>;

describe('show utility function', () => {
  it('Verify that function can show and hide a node', async () => {
    const shown = show(true, <Component />);
    const hidden = show(false, <Component />);
    const unmounted = show(false, <Component />, true);

    expect(shown).not.toBeNull();
    expect(hidden).not.toBeNull();
    expect(unmounted).toBeNull();

    expect(shown.props).toEqual({ children: <Component /> });

    expect(hidden.type).toBeInstanceOf(Function);
    expect(hidden.type.name).toBe('Hidden');
    expect(hidden.props).toEqual({ children: <Component /> });
  });
});

describe('mount utility function', () => {
  it('Verify that function can mount and unmount a node', async () => {
    const mounted = mount(true, <Component />);
    const unmounted = mount(false, <Component />);

    expect(mounted).not.toBeNull();
    expect(unmounted).toBeNull();

    expect(mounted.props).toEqual({ children: <Component /> });
  });
});
