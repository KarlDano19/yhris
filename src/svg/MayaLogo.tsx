import React from 'react';
import styled from 'styled-components';

// import { static_images } from "../initialData";

const CustomImg = styled.img`
  height: 100%;
  width: 100%;
`;

const MayaLogo = () => {
  return <CustomImg src={`${process.env.NEXT_PUBLIC_IMG_URL}/static/assets/maya-logo.png`} alt='maya-logo' />;
};

export default MayaLogo;
