import { TRASH_TYPES } from '../consts';
import config from '../config';

const wavesConfig = config.waves;
const binsConfig = wavesConfig.bins;
const trashConfig = wavesConfig.trash;

const generateBins = function () {
  return TRASH_TYPES.map((trashBin, i) => {
    const z = binsConfig.startFrom;
    const plusMinus = i % 2 ? -1 : 1;
    let x = binsConfig.gap * plusMinus * (Math.floor(i / 2) + (i % 2));
    if (TRASH_TYPES.length % 2 === 0) {
      x += binsConfig.gap / 2;
    }
    trashBin.position = `${x} 0.4 ${z}`;
    return trashBin;
  });
};

export default function waveGenerator() {
  const bins = generateBins();
  return {
    trashBins: bins,
    trash: {
      count: Infinity, // Không giới hạn rác xuất hiện
      types: TRASH_TYPES.map((t) => t.type), // Tất cả các loại rác
      maxPosition: {
        x: 1,
        y: 1.5,
        z: 1,
      },
    },
  };
}
