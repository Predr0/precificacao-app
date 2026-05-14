import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Largura base do Pixel 7 (padrão de design)
const baseWidth = 412; 

const scale = SCREEN_WIDTH / baseWidth;

export function rf(size) {
  const newSize = size * scale;
  // Arredonda para o valor mais próximo e ajusta conforme o sistema
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}