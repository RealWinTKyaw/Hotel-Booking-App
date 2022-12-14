import styled from "styled-components";
const StyledBanner = styled.header`
  min-height: 60vh;
  background: url(${props => (props.img ? props.img : null)}) center/contain no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default StyledBanner;
