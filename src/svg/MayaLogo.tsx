import React from 'react';
import styled from 'styled-components';

// import { static_images } from "../initialData";

const CustomImg = styled.img`
  height: 100%;
  width: 100%;
`;

const MayaLogo = () => {
  return <CustomImg src={`/static/assets/maya-logo.png`} alt='maya-logo' />;
};

export default MayaLogo;
