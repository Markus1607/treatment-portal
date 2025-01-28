import { LampListEnums } from 'utils/options.d';
import dermarisLampImage from 'assets/images/dermaris_lamp_image.svg';
import multiliteLampImage from 'assets/images/multilite_lamp_image.jpg';
import dermarisLampSpecs from 'assets/images/dermaris_lamp_specs.svg';
import dermarisLampTable from 'assets/images/dermaris_lamp_table.svg';
import rhodoledLampImage from 'assets/images/rhodoled_lamp_image.jpg';
import rhodoledLampSpecs from 'assets/images/rhodoled_lamp_specs.jpg';
import rhodoledLampTable from 'assets/images/rhodoled_lamp_table.jpg';
import aktiliteLampImage from 'assets/images/aktilite_lamp_image.jpg';
import aktiliteLampSpecs from 'assets/images/aktilite_lamp_specs.jpg';
import multillteLampSpecs from 'assets/images/multillte_lamp_specs.jpg';
import multilitePowerTable from 'assets/images/multilite_power_table.jpg';

export const conventionalPDTList = [
  {
    id: 'randomID2',
    protocolName: 'European Dermatology Forum Guidelines Conventional PDT',
    makeDefault: true,
    isPredefinedProtocol: true,
    data: {
      protocolName: 'European Dermatology Forum Guidelines Conventional PDT',
      protocolDescription:
        'Standard protocol for conventional PDT as derived from the European Dermatology Forum Guidelines (Morton et al. 2019, Morton et al. 2020)',
      emollient: 'no',
      alcohol: 'false',
      microNeeding: 'false',
      fractionalLaser: 'false',
      scrapingLesions: 'false',
      lampType: '1',
      prodrug: 'ameluz',
      prodrugDuration: '5',
      photodynamicDiagnosis: 'false',
      ppixDose: '37',
    },
  },
];

export const combinedPDTList = [
  {
    id: 'randomID3',
    protocolName: 'European Dermatology Forum Guidelines Combined PDT',
    makeDefault: true,
    isPredefinedProtocol: true,
    data: {
      protocolName: 'European Dermatology Forum Guidelines Combined PDT',
      protocolDescription:
        'Standard protocol for Combined PDT as derived from the European Dermatology Forum Guidelines (Morton et al. 2019, Morton et al. 2020)',
      emollient: 'no',
      alcohol: 'false',
      microNeeding: 'false',
      fractionalLaser: 'false',
      scrapingLesions: 'false',
      lampType: '1',
      prodrug: 'ameluz',
      prodrugDuration: '5',
      photodynamicDiagnosis: 'false',
      ppixDose: '37',
    },
  },
];

export const pdtLampImages = {
  artificial: {
    [LampListEnums.Multilite]: {
      lampImage: multiliteLampImage,
      lampSpecs: multillteLampSpecs,
      lampTable: multilitePowerTable,
    },
    [LampListEnums.Dermaris]: {
      lampImage: dermarisLampImage,
      lampSpecs: dermarisLampSpecs,
      lampTable: dermarisLampTable,
    },
  },
  conventional: {
    1: {
      lampImage: multiliteLampImage,
      lampSpecs: multillteLampSpecs,
      lampTable: multilitePowerTable,
    },
    2: {
      lampImage: rhodoledLampImage,
      lampSpecs: rhodoledLampSpecs,
      lampTable: rhodoledLampTable,
    },
    3: {
      lampImage: aktiliteLampImage,
      lampSpecs: aktiliteLampSpecs,
      lampTable: '',
    },
    4: {
      lampImage: dermarisLampImage,
      lampSpecs: dermarisLampSpecs,
      lampTable: dermarisLampTable,
    },
  },
};

export type artificialKeyLampType = keyof typeof pdtLampImages.artificial;
export type conventionalKeyLampType = keyof typeof pdtLampImages.conventional;
