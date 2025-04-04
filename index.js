const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./cars.db', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Database Tables
const initializeDatabase = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        full_name TEXT,
        phone TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS car_brands (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        logo_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS car_models (
        id TEXT PRIMARY KEY,
        brand_id TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (brand_id) REFERENCES car_brands(id),
        UNIQUE(brand_id, name)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS car_listings (
        id TEXT PRIMARY KEY,
        seller_id TEXT NOT NULL,
        brand_id TEXT NOT NULL,
        model_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        year INTEGER NOT NULL,
        price REAL NOT NULL,
        mileage INTEGER NOT NULL,
        condition TEXT NOT NULL CHECK(condition IN ('new', 'used', 'certified')),
        transmission TEXT NOT NULL CHECK(transmission IN ('automatic', 'manual')),
        color TEXT,
        vin TEXT,
        images TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES profiles(id),
        FOREIGN KEY (brand_id) REFERENCES car_brands(id),
        FOREIGN KEY (model_id) REFERENCES car_models(id)
      )
    `);
  });
};

// Seed initial data if tables are empty
const seedDatabase = () => {
  const insertIfEmpty = (table, countQuery, insertQuery, data) => {
    db.get(countQuery, (err, row) => {
      if (row.count === 0) {
        data.forEach(item => db.run(insertQuery, Object.values(item)));
        console.log(`Sample data inserted into ${table}.`);
      }
    });
  };

  insertIfEmpty('car_brands', 'SELECT COUNT(*) AS count FROM car_brands',
    `INSERT INTO car_brands (id, name, logo_url) VALUES (?, ?, ?)`,
    [
      { id: '1', name: 'Mercedes-Benz', logo_url: 'https://example.com/mercedes.png' },
      { id: '2', name: 'BMW', logo_url: 'https://example.com/bmw.png' },
      { id: '3', name: 'Audi', logo_url: 'https://example.com/audi.png' },
      { id: '4', name: 'Porsche', logo_url: 'https://example.com/porsche.png' },
      { id: '5', name: 'Volkswagen', logo_url: 'https://example.com/vw.png' }
    ]
  );

  insertIfEmpty('car_models', 'SELECT COUNT(*) AS count FROM car_models',
    `INSERT INTO car_models (id, brand_id, name) VALUES (?, ?, ?)`,
    [
        {id: '1', brand_id: '2', name: '1 Series'},
        {id: '2', brand_id: '2', name: '2 Series'},
        {id: '3', brand_id: '2', name: '3 Series'},
        {id: '4', brand_id: '2', name: '5 Series'},
        {id: '5', brand_id: '2', name: '6 Series'},
        {id: '6', brand_id: '2', name: '7 Series'},
        {id: '7', brand_id: '2', name: '8 Series'},
        {id: '8', brand_id: '2', name: 'M3'},
        {id: '9', brand_id: '2', name: 'M4'},
        {id: '10', brand_id: '2', name: 'M5'},
        {id: '11', brand_id: '2', name: 'M6'},
        {id: '12', brand_id: '2', name: 'M8'},
        {id: '13', brand_id: '2', name: 'X1'},
        {id: '14', brand_id: '2', name: 'X2'},
        {id: '15', brand_id: '2', name: 'X3'},
        {id: '16', brand_id: '2', name: 'X4'},
        {id: '17', brand_id: '2', name: 'X5'},
        {id: '18', brand_id: '2', name: 'X6'},
        {id: '19', brand_id: '2', name: 'X7'},
        {id: '20', brand_id: '2', name: 'Z3'},
        {id: '21', brand_id: '2', name: 'Z4'},
        {id: '22', brand_id: '2', name: 'Z8'},
        {id: '23', brand_id: '2', name: '128i'},
        {id: '24', brand_id: '2', name: '135i'},
        {id: '25', brand_id: '2', name: '135is'},
        {id: '26', brand_id: '2', name: '1 Series M'},
        {id: '27', brand_id: '2', name: '228i'},
        {id: '28', brand_id: '2', name: '228i Gran Coupe'},
        {id: '29', brand_id: '2', name: '228i xDrive'},
        {id: '30', brand_id: '2', name: '228i xDrive Gran Coupe'},
        {id: '31', brand_id: '2', name: '230i'},
        {id: '32', brand_id: '2', name: 'M235i'},
        {id: '33', brand_id: '2', name: 'M235i xDrive'},
        {id: '34', brand_id: '2', name: 'M235i xDrive Gran Coupe'},
        {id: '35', brand_id: '2', name: 'M240i'},
        {id: '36', brand_id: '2', name: 'M240i xDrive'},
        {id: '37', brand_id: '2', name: '318i'},
        {id: '38', brand_id: '2', name: '318iS'},
        {id: '39', brand_id: '2', name: '318ti'},
        {id: '40', brand_id: '2', name: '320i'},
        {id: '41', brand_id: '2', name: '320i xDrive'},
        {id: '42', brand_id: '2', name: '323ci'},
        {id: '43', brand_id: '2', name: '323i'},
        {id: '44', brand_id: '2', name: '323is'},
        {id: '45', brand_id: '2', name: '325'},
        {id: '46', brand_id: '2', name: '325ci'},
        {id: '47', brand_id: '2', name: '325e'},
        {id: '48', brand_id: '2', name: '325es'},
        {id: '49', brand_id: '2', name: '325i'},
        {id: '50', brand_id: '2', name: '325is'},
        {id: '51', brand_id: '2', name: '325iX'},
        {id: '52', brand_id: '2', name: '325xi'},
        {id: '53', brand_id: '2', name: '328Ci'},
        {id: '54', brand_id: '2', name: '328d'},
        {id: '55', brand_id: '2', name: '328d xDrive'},
        {id: '56', brand_id: '2', name: '328i'},
        {id: '57', brand_id: '2', name: '328i Gran Turismo xDrive'},
        {id: '58', brand_id: '2', name: '328i xDrive'},
        {id: '59', brand_id: '2', name: '328iS'},
        {id: '60', brand_id: '2', name: '328xi'},
        {id: '61', brand_id: '2', name: '330ci'},
        {id: '62', brand_id: '2', name: '330e'},
        {id: '63', brand_id: '2', name: '330e xDrive'},
        {id: '64', brand_id: '2', name: '330i'},
        {id: '65', brand_id: '2', name: '330i Gran Turismo xDrive'},
        {id: '66', brand_id: '2', name: '330i xDrive'},
        {id: '67', brand_id: '2', name: '330xi'},
        {id: '68', brand_id: '2', name: '335d'},
        {id: '69', brand_id: '2', name: '335i'},
        {id: '70', brand_id: '2', name: '335i Gran Turismo xDrive'},
        {id: '71', brand_id: '2', name: '335i xDrive'},
        {id: '72', brand_id: '2', name: '335is'},
        {id: '73', brand_id: '2', name: '335xi'},
        {id: '74', brand_id: '2', name: '340i'},
        {id: '75', brand_id: '2', name: '340i Gran Turismo xDrive'},
        {id: '76', brand_id: '2', name: '340i xDrive'},
        {id: '77', brand_id: '2', name: 'ActiveHybrid 3'},
        {id: '78', brand_id: '2', name: 'M340i'},
        {id: '79', brand_id: '2', name: 'M340i xDrive'},
        {id: '80', brand_id: '2', name: '428i'},
        {id: '81', brand_id: '2', name: '428i Gran Coupe'},
        {id: '82', brand_id: '2', name: '428i Gran Coupe xDrive'},
        {id: '83', brand_id: '2', name: '428i xDrive'},
        {id: '84', brand_id: '2', name: '430i'},
        {id: '85', brand_id: '2', name: '430i Gran Coupe'},
        {id: '86', brand_id: '2', name: '430i Gran Coupe xDrive'},
        {id: '87', brand_id: '2', name: '430i xDrive'},
        {id: '88', brand_id: '2', name: '435i'},
        {id: '89', brand_id: '2', name: '435i Gran Coupe'},
        {id: '90', brand_id: '2', name: '435i Gran Coupe xDrive'},
        {id: '91', brand_id: '2', name: '435i xDrive'},
        {id: '92', brand_id: '2', name: '440i'},
        {id: '93', brand_id: '2', name: '440i Gran Coupe'},
        {id: '94', brand_id: '2', name: '440i Gran Coupe xDrive'},
        {id: '95', brand_id: '2', name: '440i xDrive'},
        {id: '96', brand_id: '2', name: 'M440i'},
        {id: '97', brand_id: '2', name: 'M440i Gran Coupe'},
        {id: '98', brand_id: '2', name: 'M440i xDrive'},
        {id: '99', brand_id: '2', name: 'M440i xDrive Gran Coupe'},
        {id: '100', brand_id: '2', name: '524td'},
        {id: '101', brand_id: '2', name: '525i'},
        {id: '102', brand_id: '2', name: '525xi'},
        {id: '103', brand_id: '2', name: '528e'},
        {id: '104', brand_id: '2', name: '528i'},
        {id: '105', brand_id: '2', name: '528i xDrive'},
        {id: '106', brand_id: '2', name: '528xi'},
        {id: '107', brand_id: '2', name: '530e'},
        {id: '108', brand_id: '2', name: '530e xDrive'},
        {id: '109', brand_id: '2', name: '530i'},
        {id: '110', brand_id: '2', name: '530i xDrive'},
        {id: '111', brand_id: '2', name: '530xi'},
        {id: '112', brand_id: '2', name: '533i'},
        {id: '113', brand_id: '2', name: '535d'},
        {id: '114', brand_id: '2', name: '535d xDrive'},
        {id: '115', brand_id: '2', name: '535i'},
        {id: '116', brand_id: '2', name: '535i Gran Turismo'},
        {id: '117', brand_id: '2', name: '535i Gran Turismo xDrive'},
        {id: '118', brand_id: '2', name: '535i xDrive'},
        {id: '119', brand_id: '2', name: '535xi'},
        {id: '120', brand_id: '2', name: '540d xDrive'},
        {id: '121', brand_id: '2', name: '540i'},
        {id: '122', brand_id: '2', name: '540i xDrive'},
        {id: '123', brand_id: '2', name: '545i'},
        {id: '124', brand_id: '2', name: '550e xDrive'},
        {id: '125', brand_id: '2', name: '550i'},
        {id: '126', brand_id: '2', name: '550i Gran Turismo'},
        {id: '127', brand_id: '2', name: '550i Gran Turismo xDrive'},
        {id: '128', brand_id: '2', name: '550i xDrive'},
        {id: '129', brand_id: '2', name: 'ActiveHybrid 5'},
        {id: '130', brand_id: '2', name: 'M550i xDrive'},
        {id: '131', brand_id: '2', name: '633CSi'},
        {id: '132', brand_id: '2', name: '635CSi'},
        {id: '133', brand_id: '2', name: '640i'},
        {id: '134', brand_id: '2', name: '640i Gran Coupe'},
        {id: '135', brand_id: '2', name: '640i Gran Coupe xDrive'},
        {id: '136', brand_id: '2', name: '640i Gran Turismo xDrive'},
        {id: '137', brand_id: '2', name: '640i xDrive'},
        {id: '138', brand_id: '2', name: '645ci'},
        {id: '139', brand_id: '2', name: '650i'},
        {id: '140', brand_id: '2', name: '650i Gran Coupe'},
        {id: '141', brand_id: '2', name: '650i Gran Coupe xDrive'},
        {id: '142', brand_id: '2', name: '650i xDrive'},
        {id: '143', brand_id: '2', name: 'ALPINA B6 xDrive Gran Coupe'},
        {id: '144', brand_id: '2', name: 'L6'},
        {id: '145', brand_id: '2', name: '733i'},
        {id: '146', brand_id: '2', name: '735i'},
        {id: '147', brand_id: '2', name: '735iL'},
        {id: '148', brand_id: '2', name: '740e xDrive'},
        {id: '149', brand_id: '2', name: '740i'},
        {id: '150', brand_id: '2', name: '740i xDrive'},
        {id: '151', brand_id: '2', name: '740iL'},
        {id: '152', brand_id: '2', name: '740Ld xDrive'},
        {id: '153', brand_id: '2', name: '740Li'},
        {id: '154', brand_id: '2', name: '740Li xDrive'},
        {id: '155', brand_id: '2', name: '745e xDrive'},
        {id: '156', brand_id: '2', name: '745i'},
        {id: '157', brand_id: '2', name: '745Li'},
        {id: '158', brand_id: '2', name: '750e xDrive'},
        {id: '159', brand_id: '2', name: '750i'},
        {id: '160', brand_id: '2', name: '750i xDrive'},
        {id: '161', brand_id: '2', name: '750iL'},
        {id: '162', brand_id: '2', name: '750Li'},
        {id: '163', brand_id: '2', name: '750Li xDrive'},
        {id: '164', brand_id: '2', name: '760i'},
        {id: '165', brand_id: '2', name: '760i xDrive'},
        {id: '166', brand_id: '2', name: '760Li'},
        {id: '167', brand_id: '2', name: 'ActiveHybrid 7'},
        {id: '168', brand_id: '2', name: 'ALPINA B7 xDrive'},
        {id: '169', brand_id: '2', name: 'L7'},
        {id: '170', brand_id: '2', name: 'M760i xDrive'},
        {id: '171', brand_id: '2', name: '840ci'},
        {id: '172', brand_id: '2', name: '840i Gran Coupe'},
        {id: '173', brand_id: '2', name: '840i Gran Coupe xDrive'},
        {id: '174', brand_id: '2', name: '840i xDrive'},
        {id: '175', brand_id: '2', name: '850ci'},
        {id: '176', brand_id: '2', name: '850CSi'},
        {id: '177', brand_id: '2', name: '850i'},
        {id: '178', brand_id: '2', name: 'ALPINA B8 xDrive Gran Coupe'},
        {id: '179', brand_id: '2', name: 'M850i Gran Coupe xDrive'},
        {id: '180', brand_id: '2', name: 'M850i xDrive'},
        {id: '181', brand_id: '2', name: 'ActiveHybrid X6'},
        {id: '182', brand_id: '2', name: 'ALPINA XB7'},
        {id: '183', brand_id: '2', name: 'i3'},
        {id: '184', brand_id: '2', name: 'i4'},
        {id: '185', brand_id: '2', name: 'i5'},
        {id: '186', brand_id: '2', name: 'i7'},
        {id: '187', brand_id: '2', name: 'i8'},
        {id: '188', brand_id: '2', name: 'iX'},
        {id: '189', brand_id: '2', name: 'M Coupe'},
        {id: '190', brand_id: '2', name: 'M Roadster'},
        {id: '191', brand_id: '2', name: 'M3 xDrive'},
        {id: '192', brand_id: '2', name: 'M4 xDrive'},
        {id: '193', brand_id: '2', name: 'M6 Gran Coupe'},
        {id: '194', brand_id: '2', name: 'M8 Gran Coupe xDrive'},
        {id: '195', brand_id: '2', name: 'X3 M'},
        {id: '196', brand_id: '2', name: 'X4 M'},
        {id: '197', brand_id: '2', name: 'X5 M'},
        {id: '198', brand_id: '2', name: 'X6 M'},
        {id: '199', brand_id: '2', name: 'XM'},
      {id: '200', brand_id: '2', name: 'Other'},


      
        {id: '201', brand_id: '1', name: 'A-Class'},
        {id: '202', brand_id: '1', name: 'B-Class'},
        {id: '203', brand_id: '1', name: 'C-Class'},
        {id: '204', brand_id: '1', name: 'CLA-Class'},
        {id: '205', brand_id: '1', name: 'CLS-Class'},
        {id: '206', brand_id: '1', name: 'E-Class'},
        {id: '207', brand_id: '1', name: 'GLA-Class'},
        {id: '208', brand_id: '1', name: 'GLB-Class'},
        {id: '209', brand_id: '1', name: 'GLC-Class'},
        {id: '210', brand_id: '1', name: 'GLE-Class'},
        {id: '211', brand_id: '1', name: 'GLS-Class'},
        {id: '212', brand_id: '1', name: 'S-Class'},
        {id: '213', brand_id: '1', name: 'SL-Class'},
        {id: '214', brand_id: '1', name: 'SLC-Class'},
        {id: '215', brand_id: '1', name: 'Maybach S-Class'},
        {id: '216', brand_id: '1', name: 'EQB'},
        {id: '217', brand_id: '1', name: 'EQC'},
        {id: '218', brand_id: '1', name: 'EQE'},
        {id: '219', brand_id: '1', name: 'EQS'},
        {id: '220', brand_id: '1', name: 'G-Class'},
        {id: '221', brand_id: '1', name: 'AMG GT'},
        {id: '222', brand_id: '1', name: 'AMG C43'},
        {id: '223', brand_id: '1', name: 'AMG E63'},
        {id: '224', brand_id: '1', name: 'AMG G63'},
        {id: '225', brand_id: '1', name: 'AMG A45'},
        {id: '226', brand_id: '1', name: 'AMG CLA45'},
        {id: '227', brand_id: '1', name: 'AMG GLC63'},
        {id: '228', brand_id: '1', name: 'AMG S63'},
        {id: '229', brand_id: '1', name: 'AMG GT 4-Door'},
        {id: '230', brand_id: '1', name: 'AMG SL 63'},
        {id: '231', brand_id: '1', name: 'AMG GLE53'},
        {id: '232', brand_id: '1', name: 'AMG GLA45'},



      
        {id: '233', brand_id: '3', name: 'A1'},
        {id: '234', brand_id: '3', name: 'A3'},
        {id: '235', brand_id: '3', name: 'A4'},
        {id: '236', brand_id: '3', name: 'A5'},
        {id: '237', brand_id: '3', name: 'A6'},
        {id: '238', brand_id: '3', name: 'A7'},
        {id: '239', brand_id: '3', name: 'A8'},
        {id: '240', brand_id: '3', name: 'Q2'},
        {id: '241', brand_id: '3', name: 'Q3'},
        {id: '242', brand_id: '3', name: 'Q4 e-tron'},
        {id: '243', brand_id: '3', name: 'Q5'},
        {id: '244', brand_id: '3', name: 'Q7'},
        {id: '245', brand_id: '3', name: 'Q8'},
        {id: '246', brand_id: '3', name: 'R8'},
        {id: '247', brand_id: '3', name: 'S3'},
        {id: '248', brand_id: '3', name: 'S4'},
        {id: '249', brand_id: '3', name: 'S5'},
        {id: '250', brand_id: '3', name: 'S6'},
        {id: '251', brand_id: '3', name: 'S7'},
        {id: '252', brand_id: '3', name: 'S8'},
        {id: '253', brand_id: '3', name: 'RS3'},
        {id: '254', brand_id: '3', name: 'RS4'},
        {id: '255', brand_id: '3', name: 'RS5'},
        {id: '256', brand_id: '3', name: 'RS6'},
        {id: '257', brand_id: '3', name: 'RS7'},
        {id: '258', brand_id: '3', name: 'RS Q3'},
        {id: '259', brand_id: '3', name: 'RS Q5'},
        {id: '260', brand_id: '3', name: 'RS Q8'},
        {id: '261', brand_id: '3', name: 'e-tron'},
        {id: '262', brand_id: '3', name: 'e-tron GT'},
        {id: '263', brand_id: '3', name: 'e-tron S'},
        {id: '264', brand_id: '3', name: 'e-tron S Sportback'},
        {id: '265', brand_id: '3', name: 'Q5 e-tron'},
        {id: '266', brand_id: '3', name: 'S Q5'},
        {id: '267', brand_id: '3', name: 'A4 Avant'},
        {id: '268', brand_id: '3', name: 'A6 Avant'},
        {id: '269', brand_id: '3', name: 'A7 Sportback'},
        {id: '270', brand_id: '3', name: 'RS Q8'},



      
        {id: '271', brand_id: '4', name: '718 Cayman'},
        {id: '272', brand_id: '4', name: '718 Boxster'},
        {id: '273', brand_id: '4', name: '911'},
        {id: '274', brand_id: '4', name: '911 Carrera'},
        {id: '275', brand_id: '4', name: '911 Turbo'},
        {id: '276', brand_id: '4', name: '911 GT3'},
        {id: '277', brand_id: '4', name: '911 GT2 RS'},
        {id: '278', brand_id: '4', name: '911 Targa'},
        {id: '279', brand_id: '4', name: 'Cayenne'},
        {id: '280', brand_id: '4', name: 'Cayenne Coupe'},
        {id: '281', brand_id: '4', name: 'Macan'},
        {id: '282', brand_id: '4', name: 'Macan GTS'},
        {id: '283', brand_id: '4', name: 'Panamera'},
        {id: '284', brand_id: '4', name: 'Panamera Sport Turismo'},
        {id: '285', brand_id: '4', name: 'Taycan'},
        {id: '286', brand_id: '4', name: 'Taycan Cross Turismo'},
        {id: '287', brand_id: '4', name: 'Taycan Turbo'},
        {id: '288', brand_id: '4', name: 'Taycan Turbo S'},
        {id: '289', brand_id: '4', name: 'Taycan 4S'},
        {id: '290', brand_id: '4', name: 'Taycan 4S Cross Turismo'},
        {id: '291', brand_id: '4', name: '911 Speedster'},
        {id: '292', brand_id: '4', name: '911 R'},
        {id: '290', brand_id: '4', name: '911 Turbo S'},
        {id: '291', brand_id: '4', name: 'Cayenne E-Hybrid'},
        {id: '292', brand_id: '4', name: 'Macan Turbo'},





      

      {id: '293', brand_id: '5', name: 'Golf'},
      {id: '294', brand_id: '5', name: 'Golf GTI'},
      {id: '295', brand_id: '5', name: 'Golf R'},
      {id: '296', brand_id: '5', name: 'Jetta'},
      {id: '297', brand_id: '5', name: 'Jetta GLI'},
      {id: '298', brand_id: '5', name: 'Passat'},
      {id: '299', brand_id: '5', name: 'Arteon'},
      {id: '300', brand_id: '5', name: 'Phaeton'},
      {id: '301', brand_id: '5', name: 'Beetle'},
      {id: '302', brand_id: '5', name: 'Tiguan'},
      {id: '303', brand_id: '5', name: 'Touareg'},
      {id: '304', brand_id: '5', name: 'Atlas'},
      {id: '305', brand_id: '5', name: 'Atlas Cross Sport'},
      {id: '306', brand_id: '5', name: 'ID.3'},
      {id: '307', brand_id: '5', name: 'ID.4'},
      {id: '308', brand_id: '5', name: 'ID.5'},
      {id: '309', brand_id: '5', name: 'ID.7'},
      {id: '310', brand_id: '5', name: 'ID.Buzz'},
      {id: '311', brand_id: '5', name: 'T-Roc'},
      {id: '312', brand_id: '5', name: 'T-Cross'},
      {id: '313', brand_id: '5', name: 'Taos'},
      {id: '314', brand_id: '5', name: 'Amarok'},
      {id: '315', brand_id: '5', name: 'Scirocco'},
      {id: '316', brand_id: '5', name: 'Corrado'},
      {id: '317', brand_id: '5', name: 'Eos'},
      {id: '318', brand_id: '5', name: 'Fox'},
      {id: '319', brand_id: '5', name: 'Up!'},


    ]
  );
};

initializeDatabase();
seedDatabase();

// API Routes
app.get('/api/car-brands', (req, res) => {
  db.all('SELECT name FROM car_brands', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/car-models', (req, res) => {
  const { brand } = req.query;
  if (!brand) return res.json([]);

  const query = `SELECT name FROM car_models WHERE brand_id = (SELECT id FROM car_brands WHERE name = ?)`;
  db.all(query, [brand], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/car-listings', (req, res) => {
  const { brand, model, year, minPrice, maxPrice } = req.query;
  let query = `
    SELECT car_listings.*, car_brands.name AS brand_name, car_models.name AS model_name
    FROM car_listings
    JOIN car_brands ON car_listings.brand_id = car_brands.id
    JOIN car_models ON car_listings.model_id = car_models.id
    WHERE 1=1`;

  const params = [];
  if (brand) { query += ' AND car_brands.name = ?'; params.push(brand); }
  if (model) { query += ' AND car_models.name = ?'; params.push(model); }
  if (year) { query += ' AND car_listings.year = ?'; params.push(year); }
  if (minPrice) { query += ' AND car_listings.price >= ?'; params.push(minPrice); }
  if (maxPrice) { query += ' AND car_listings.price <= ?'; params.push(maxPrice); }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});





























// Start the server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));