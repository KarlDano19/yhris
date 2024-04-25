import React from 'react';
import styled from 'styled-components';

// import { static_images } from "../initialData";

const CustomImg = styled.img`
  height: 100%;
  width: 100%;
`;

const PaymongoLogo = () => {
  return <CustomImg src={`${process.env.NEXT_PUBLIC_IMG_URL}/static/assets/paymongo-logo.png`} alt='paymongo_logo' />;
};

export default PaymongoLogo;
