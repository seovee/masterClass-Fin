import styled from "styled-components";

const FooterWrapper = styled.footer`
  display: flex;
  justify-content: center;
`;

function Footer() {
  return (
    <FooterWrapper>
      <span> Copyright 2023. JinSeob Kim. All rights reserved.</span>
    </FooterWrapper>
  );
}

export default Footer;
