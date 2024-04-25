import React from 'react';
import styled from 'styled-components';

const CustomImg = styled.img`
  height: 100%;
  width: 100%;
`;

const DragonpayLogo = () => {
  return <CustomImg src={`${process.env.NEXT_PUBLIC_IMG_URL}/static/assets/dragonpay-logo.png`} alt='dragonpay-logo' />;
};

export default DragonpayLogo;
