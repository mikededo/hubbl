import Link from 'next/link';

import { Home } from '@mui/icons-material';
import {
  Breadcrumbs,
  Stack,
  styled,
  Link as MuiLink,
  Typography
} from '@mui/material';

const HomeIcon = styled(Home)(({ theme }) => ({
  fontSize: theme.spacing(2.25)
}));

const PageBreadcrumbs = styled(Breadcrumbs)({
  '& li:first-of-type': { display: 'inherit' }
});

type PageHeaderBreadcrumb = {
  /**
   * Href of the `Link` component that is rendered as a breadcrumb
   */
  href: string;

  /**
   * Label to display of the breadcrumb
   */
  label: string;
};

export type PageHeaderProps = {
  /**
   * `Breadcrumbs` to display over the header
   */
  breadcrumbs: PageHeaderBreadcrumb[];

  /**
   * Title to display as the header
   */
  title: string;
};

const PageHeader = ({ breadcrumbs, title }: PageHeaderProps) => (
  <Stack gap={1.5}>
    <PageBreadcrumbs aria-label="breadcrumb">
      <HomeIcon />

      {breadcrumbs.map(({ href, label }, i) => {
        const last = i === breadcrumbs.length - 1;

        return (
          <Link key={href} href={href} passHref>
            <MuiLink
              variant="body2"
              color={last ? 'text.primary' : 'text.secondary'}
              underline={last ? 'none' : 'hover'}
              aria-current={last ? 'page' : undefined}
            >
              {label}
            </MuiLink>
          </Link>
        );
      })}
    </PageBreadcrumbs>

    <Typography variant="h1">{title}</Typography>
  </Stack>
);

export default PageHeader;
