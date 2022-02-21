import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface UiComponentsProps {}

const StyledUiComponents = styled.div`
  color: pink;
`;

export function UiComponents(props: UiComponentsProps) {
  return (
    <StyledUiComponents>
      <h1>Welcome to UiComponents!</h1>
    </StyledUiComponents>
  );
}

export default UiComponents;
