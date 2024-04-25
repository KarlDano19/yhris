import React from 'react';
import styled from 'styled-components';

// import { static_images } from "../initialData";

const CustomImg = styled.img`
  height: 100%;
  width: 100%;
`;

const PaymongoLogo = () => {
  return <CustomImg src={`/static/assets/paymongo-logo.png`} alt='paymongo_logo' />;
};

export default PaymongoLogo;
