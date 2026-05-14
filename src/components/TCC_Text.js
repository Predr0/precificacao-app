// src/components/TCC_Text.js
import React from 'react';
import { Text } from 'react-native';
import { rf } from '../utils/responsividade';

export default function TCC_Text({ style, children, size = 14, ...props }) {
  // Pegamos o tamanho base (size) e passamos pela função rf()
  return (
    <Text 
      {...props} 
      style={[style, { fontSize: rf(size) }]}
    >
      {children}
    </Text>
  );
}