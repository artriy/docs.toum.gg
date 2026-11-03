import type {ReactNode} from 'react';
import Layout from '@theme-original/DocCard/Layout';
import type LayoutType from '@theme/DocCard/Layout';
import type {WrapperProps} from '@docusaurus/types';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useRosterLookup} from '@site/src/components/useRoster';

type Props = WrapperProps<typeof LayoutType>;

export default function DocCardLayoutWrapper(props: Props): ReactNode {
  const entry = useRosterLookup().get(props.href);
  const icon = useBaseUrl(entry?.icon ?? '/img/logo.png');
  return <Layout {...props} icon={entry?.icon ? <img src={icon} alt="" width={42} height={42} /> : null} />;
}
