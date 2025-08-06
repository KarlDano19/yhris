const regions = [
  {
    value: 'Metro Manila',
    label: 'Metro Manila',
  },
  {
    value: 'Abra',
    label: 'Abra',
  },
  {
    value: 'Apayao',
    label: 'Apayao',
  },
  {
    value: 'Benguet',
    label: 'Benguet',
  },
  {
    value: 'Ifugao',
    label: 'Ifugao',
  },
  {
    value: 'Kalinga',
    label: 'Kalinga',
  },
  {
    value: 'Mountain Province',
    label: 'Mountain Province',
  },
  {
    value: 'Ilocos Norte',
    label: 'Ilocos Norte',
  },
  {
    value: 'Ilocos Sur',
    label: 'Ilocos Sur',
  },
  {
    value: 'La Union',
    label: 'La Union',
  },
  {
    value: 'Pangasinan',
    label: 'Pangasinan',
  },
  {
    value: 'Aurora',
    label: 'Aurora',
  },
  {
    value: 'Bataan',
    label: 'Bataan',
  },
  {
    value: 'Bulacan',
    label: 'Bulacan',
  },
  {
    value: 'Nueva Ecija',
    label: 'Nueva Ecija',
  },
  {
    value: 'Pampanga',
    label: 'Pampanga',
  },
  {
    value: 'Tarlac',
    label: 'Tarlac',
  },
  {
    value: 'Zambales',
    label: 'Zambales',
  },
  {
    value: 'Batangas',
    label: 'Batangas',
  },
  {
    value: 'Cavite',
    label: 'Cavite',
  },
  {
    value: 'Laguna',
    label: 'Laguna',
  },
  {
    value: 'Quezon',
    label: 'Quezon',
  },
  {
    value: 'Rizal',
    label: 'Rizal',
  },
  {
    value: 'Marinduque',
    label: 'Marinduque',
  },
  {
    value: 'Occidental Mindoro',
    label: 'Occidental Mindoro',
  },
  {
    value: 'Oriental Mindoro',
    label: 'Oriental Mindoro',
  },
  {
    value: 'Palawan',
    label: 'Palawan',
  },
  {
    value: 'Romblon',
    label: 'Romblon',
  },
  {
    value: 'Albay',
    label: 'Albay',
  },
  {
    value: 'Camarines Norte',
    label: 'Camarines Norte',
  },
  {
    value: 'Camarines Sur',
    label: 'Camarines Sur',
  },
  {
    value: 'Catanduanes',
    label: 'Catanduanes',
  },
  {
    value: 'Masbate',
    label: 'Masbate',
  },
  {
    value: 'Sorsogon',
    label: 'Sorsogon',
  },
  {
    value: 'Aklan',
    label: 'Aklan',
  },
  {
    value: 'Antique',
    label: 'Antique',
  },
  {
    value: 'Capiz',
    label: 'Capiz',
  },
  {
    value: 'Guimaras',
    label: 'Guimaras',
  },
  {
    value: 'Iloilo',
    label: 'Iloilo',
  },
  {
    value: 'Negros Occidental',
    label: 'Negros Occidental',
  },
  {
    value: 'Bohol',
    label: 'Bohol',
  },
  {
    value: 'Cebu',
    label: 'Cebu',
  },
  {
    value: 'Negros Oriental',
    label: 'Negros Oriental',
  },
  {
    value: 'Siquijor',
    label: 'Siquijor',
  },
  {
    value: 'Biliran',
    label: 'Biliran',
  },
  {
    value: 'Eastern Samar',
    label: 'Eastern Samar',
  },
  {
    value: 'Leyte',
    label: 'Leyte',
  },
  {
    value: 'Northern Samar',
    label: 'Northern Samar',
  },
  {
    value: 'Samar',
    label: 'Samar',
  },
  {
    value: 'Southern Leyte',
    label: 'Southern Leyte',
  },
  {
    value: 'Zamboanga del Norte',
    label: 'Zamboanga del Norte',
  },
  {
    value: 'Zamboanga del Sur',
    label: 'Zamboanga del Sur',
  },
  {
    value: 'Zamboanga Sibugay',
    label: 'Zamboanga Sibugay',
  },
  {
    value: 'Bukidnon',
    label: 'Bukidnon',
  },
  {
    value: 'Camiguin',
    label: 'Camiguin',
  },
  {
    value: 'Lanao del Norte',
    label: 'Lanao del Norte',
  },
  {
    value: 'Misamis Occidental',
    label: 'Misamis Occidental',
  },
  {
    value: 'Misamis Oriental',
    label: 'Misamis Oriental',
  },
  {
    value: 'Compostela Valley',
    label: 'Compostela Valley',
  },
  {
    value: 'Davao del Norte',
    label: 'Davao del Norte',
  },
  {
    value: 'Davao del Sur',
    label: 'Davao del Sur',
  },
  {
    value: 'Davao Occidental',
    label: 'Davao Occidental',
  },
  {
    value: 'Davao Oriental',
    label: 'Davao Oriental',
  },
  {
    value: 'Cotabato',
    label: 'Cotabato',
  },
  {
    value: 'Sarangani',
    label: 'Sarangani',
  },
  {
    value: 'South Cotabato',
    label: 'South Cotabato',
  },
  {
    value: 'Sultan Kudarat',
    label: 'Sultan Kudarat',
  },
  {
    value: 'Agusan del Norte',
    label: 'Agusan del Norte',
  },
  {
    value: 'Agusan del Sur',
    label: 'Agusan del Sur',
  },
  {
    value: 'Dinagat Islands',
    label: 'Dinagat Islands',
  },
  {
    value: 'Surigao del Norte',
    label: 'Surigao del Norte',
  },
  {
    value: 'Surigao del Sur',
    label: 'Surigao del Sur',
  },
  {
    value: 'Basilan',
    label: 'Basilan',
  },
  {
    value: 'Lanao del Sur',
    label: 'Lanao del Sur',
  },
  {
    value: 'Maguindanao',
    label: 'Maguindanao',
  },
  {
    value: 'Sulu',
    label: 'Sulu',
  },
  {
    value: 'Tawi-tawi',
    label: 'Tawi-tawi',
  },
];

export default regions;