import {
  Button,
  Container,
  Divider,
  render,
  SearchTextbox,
  Tabs,
  Text,
  Toggle,
  VerticalSpace,
} from '@create-figma-plugin/ui';
import { emit } from '@create-figma-plugin/utilities';
import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';

import icons from '../icon-paths.json';
import IconContent from './components/IconContent';
import styles from './css/input.css';
import { CreateAll, CreateSvgFrame, ICryptoIcon } from './types';

function CryptoIcons(): h.JSX.Element {
  const pageIconSize = 100;
  const [shownIcons, setShownIcons] = useState<ICryptoIcon[]>(
    icons.slice(0, pageIconSize)
  );
  let shownCount = shownIcons.length;
  const [variant, setVariant] = useState<'black' | 'color' | 'icon' | 'white'>(
    'color'
  );

  const [searchValue, setSearchValue] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<ICryptoIcon>(icons[0]);
  const [asComponent, setAsComponent] = useState(true);

  const handleCreateSvg = useCallback(() => {
    emit<CreateSvgFrame>(
      'CREATE_SVG_FRAME',
      selectedIcon,
      asComponent,
      variant
    );
  }, [selectedIcon, asComponent, variant]);
  const handleCreateAll = useCallback(() => {
    emit<CreateAll>('CREATE_ALL', icons, asComponent, variant);
  }, [asComponent, variant]);

  const handleSearch = (input: string) => {
    setSearchValue(input);

    const filteredIcons = icons.filter((icon: ICryptoIcon) => {
      return (
        icon.name.toLowerCase().includes(input) ||
        icon.symbol.toLowerCase().includes(input)
      );
    });

    setShownIcons(filteredIcons);
  };

  const handleTabSwitch = (e: any) => {
    setVariant(e.target.value);
  };

  const handleShowMore = () => {
    shownCount = shownCount + pageIconSize;
    setShownIcons(icons.slice(0, shownCount));
  };

  const tabOptions = [
    {
      children: (
        <IconContent
          variant={variant}
          shownIcons={shownIcons}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
        />
      ),
      value: 'color',
    },
    {
      children: (
        <IconContent
          variant={variant}
          shownIcons={shownIcons}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
        />
      ),
      value: 'black',
    },
    {
      children: (
        <IconContent
          variant={variant}
          shownIcons={shownIcons}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
        />
      ),
      value: 'white',
    },
    {
      children: (
        <IconContent
          variant={variant}
          shownIcons={shownIcons}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
        />
      ),
      value: 'icon',
    },
  ];

  return (
    <div>
      <SearchTextbox
        value={searchValue}
        placeholder="search"
        onValueInput={(input) => handleSearch(input.toLowerCase())}
      />
      <Divider />
      <Container space="large" style={{ marginBottom: 40 }}>
        <Tabs
          options={tabOptions}
          value={variant}
          onChange={(e: any) => handleTabSwitch(e)}
        />
        <VerticalSpace space="large" />
        {icons.length > shownIcons.length && (
          <Button secondary fullWidth onClick={handleShowMore}>
            Show More
          </Button>
        )}
        <VerticalSpace space="large" />
      </Container>
      <div class={styles.footer}>
        <Toggle
          value={asComponent}
          onChange={() => setAsComponent(!asComponent)}
        >
          <Text>As Components</Text>
        </Toggle>
        <div class={styles['button-group']}>
          <Button secondary fullWidth onClick={handleCreateAll}>
            Create All
          </Button>
          <Button fullWidth onClick={handleCreateSvg}>
            Create Selected
          </Button>
        </div>
      </div>
    </div>
  );
}

export default render(CryptoIcons);
