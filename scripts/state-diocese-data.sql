-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Table: states
create table states (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique
);

-- Table: dioceses
create table dioceses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  state_id uuid references states(id) on delete cascade
);

-- Table: parishes (to be populated later)
create table parishes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  diocese_id uuid references dioceses(id) on delete cascade
);

-- Insert states
insert into states (name) values 
('Uttar Pradesh'),
('Rajasthan'),
('Karnataka'),
('Madhya Pradesh'),
('Maharashtra'),
('West Bengal'),
('Kerala'),
('Odisha'),
('Delhi'),
('Gujarat'),
('Goa'),
('Assam'),
('Telangana'),
('Andhra Pradesh'),
('Manipur'),
('Tamil Nadu'),
('Chhattisgarh'),
('Jharkhand'),
('Meghalaya'),
('Mizoram'),
('Nagaland'),
('Bihar');

-- Uttar Pradesh & Rajasthan — Province of Agra
insert into dioceses (name, state_id)
select 'Archdiocese of Agra', s.id from states s where s.name='Uttar Pradesh';
insert into dioceses (name, state_id)
select 'Diocese of Ajmer', s.id from states s where s.name='Rajasthan';
insert into dioceses (name, state_id)
select 'Diocese of Allahabad', s.id from states s where s.name='Uttar Pradesh';
insert into dioceses (name, state_id)
select 'Diocese of Bareilly', s.id from states s where s.name='Uttar Pradesh';
insert into dioceses (name, state_id)
select 'Diocese of Jaipur', s.id from states s where s.name='Rajasthan';
insert into dioceses (name, state_id)
select 'Diocese of Jhansi', s.id from states s where s.name='Uttar Pradesh';
insert into dioceses (name, state_id)
select 'Diocese of Lucknow', s.id from states s where s.name='Uttar Pradesh';
insert into dioceses (name, state_id)
select 'Diocese of Meerut', s.id from states s where s.name='Uttar Pradesh';
insert into dioceses (name, state_id)
select 'Diocese of Udaipur', s.id from states s where s.name='Rajasthan';
insert into dioceses (name, state_id)
select 'Diocese of Varanasi', s.id from states s where s.name='Uttar Pradesh';

-- Karnataka — Province of Bangalore
insert into dioceses (name, state_id)
select 'Archdiocese of Bangalore', s.id from states s where s.name='Karnataka';
-- suffragan dioceses
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Belgaum'),
 ('Diocese of Bellary'),
 ('Diocese of Chikmagalur'),
 ('Diocese of Gulbarga'),
 ('Diocese of Karwar'),
 ('Diocese of Mangalore'),
 ('Diocese of Mysore'),
 ('Diocese of Shimoga'),
 ('Diocese of Udupi')
) as v(x), states s where s.name='Karnataka';

-- Madhya Pradesh — Province of Bhopal
insert into dioceses (name, state_id)
select 'Archdiocese of Bhopal', s.id from states s where s.name='Madhya Pradesh';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Gwalior'),
 ('Diocese of Indore'),
 ('Diocese of Jabalpur'),
 ('Diocese of Jhabua'),
 ('Diocese of Khandwa')
) as v(x), states s where s.name='Madhya Pradesh';

-- Maharashtra — Province of Bombay
insert into dioceses (name, state_id)
select 'Archdiocese of Bombay', s.id from states s where s.name='Maharashtra';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Poona'),
 ('Diocese of Vasai'),
 ('Diocese of Nashik')
) as v(x), states s where s.name='Maharashtra';

-- West Bengal — Calcutta Province
insert into dioceses (name, state_id)
select 'Archdiocese of Calcutta', s.id from states s where s.name='West Bengal';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Asansol'),
 ('Diocese of Bagdogra'),
 ('Diocese of Baruipur'),
 ('Diocese of Darjeeling'),
 ('Diocese of Jalpaiguri'),
 ('Diocese of Krishnagar'),
 ('Diocese of Raiganj')
) as v(x), states s where s.name='West Bengal';

-- Kerala — Provinces of Calicut, Trivandrum, Verapoly
insert into dioceses (name, state_id)
select 'Archdiocese of Calicut', s.id from states s where s.name='Kerala';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Kannur'),
 ('Diocese of Sultanpet')
) as v(x), states s where s.name='Kerala';

insert into dioceses (name, state_id)
select 'Archdiocese of Trivandrum', s.id from states s where s.name='Kerala';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Alleppey'),
 ('Diocese of Neyyattinkara'),
 ('Diocese of Punalur'),
 ('Diocese of Quilon')
) as v(x), states s where s.name='Kerala';

insert into dioceses (name, state_id)
select 'Archdiocese of Verapoly', s.id from states s where s.name='Kerala';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Cochin'),
 ('Diocese of Kottapuram'),
 ('Diocese of Vijayapuram')
) as v(x), states s where s.name='Kerala';

-- Odisha — Cuttack-Bhubaneswar Province
insert into dioceses (name, state_id)
select 'Archdiocese of Cuttack-Bhubaneswar', s.id from states s where s.name='Odisha';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Balasore'),
 ('Diocese of Berhampur'),
 ('Diocese of Rayagada'),
 ('Diocese of Rourkela'),
 ('Diocese of Sambalpur')
) as v(x), states s where s.name='Odisha';

-- Delhi Province
insert into dioceses (name, state_id)
select 'Archdiocese of Delhi', s.id from states s where s.name='Delhi';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Jammu-Srinagar'),
 ('Diocese of Jalandhar'),
 ('Diocese of Simla and Chandigarh')
) as v(x), states s where s.name='Delhi';

-- Gujarat — Gandhinagar Province
insert into dioceses (name, state_id)
select 'Archdiocese of Gandhinagar', s.id from states s where s.name='Gujarat';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Ahmedabad'),
 ('Diocese of Baroda')
) as v(x), states s where s.name='Gujarat';

-- Goa — Goa & Daman Province
insert into dioceses (name, state_id)
select 'Archdiocese of Goa and Daman', s.id from states s where s.name='Goa';
insert into dioceses (name, state_id)
select 'Diocese of Sindhudurg', s.id from states s where s.name='Maharashtra';

-- Assam — Guwahati Province
insert into dioceses (name, state_id)
select 'Archdiocese of Guwahati', s.id from states s where s.name='Assam';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Bongaigaon'),
 ('Diocese of Dibrugarh'),
 ('Diocese of Diphu'),
 ('Diocese of Itanagar'),
 ('Diocese of Miao'),
 ('Diocese of Tezpur')
) as v(x), states s where s.name='Assam';

-- Telangana & Andhra Pradesh — Hyderabad Province
insert into dioceses (name, state_id)
select 'Archdiocese of Hyderabad', s.id from states s where s.name='Telangana';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Cuddapah'),
 ('Diocese of Khammam'),
 ('Diocese of Kurnool'),
 ('Diocese of Nalgonda'),
 ('Diocese of Warangal')
) as v(x), states s where s.name in ('Telangana', 'Andhra Pradesh');

-- Manipur — Imphal Province
insert into dioceses (name, state_id)
select 'Archdiocese of Imphal', s.id from states s where s.name='Manipur';
insert into dioceses (name, state_id)
select 'Diocese of Kohima', s.id from states s where s.name='Nagaland';

-- Tamil Nadu — Madras-Mylapore, Madurai, Pondicherry-Cuddalore Provinces
insert into dioceses (name, state_id)
select 'Archdiocese of Madras and Mylapore', s.id from states s where s.name='Tamil Nadu';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Chingleput'),
 ('Diocese of Coimbatore'),
 ('Diocese of Ootacamund'),
 ('Diocese of Vellore')
) as v(x), states s where s.name='Tamil Nadu';

insert into dioceses (name, state_id)
select 'Archdiocese of Madurai', s.id from states s where s.name='Tamil Nadu';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Dindigul'),
 ('Diocese of Kottar'),
 ('Diocese of Kuzhithurai'),
 ('Diocese of Palayamkottai'),
 ('Diocese of Sivagangai'),
 ('Diocese of Tiruchirapalli'),
 ('Diocese of Tuticorin')
) as v(x), states s where s.name='Tamil Nadu';

insert into dioceses (name, state_id)
select 'Archdiocese of Pondicherry and Cuddalore', s.id from states s where s.name='Tamil Nadu';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Dharmapuri'),
 ('Diocese of Kumbakonam'),
 ('Diocese of Salem'),
 ('Diocese of Tanjore')
) as v(x), states s where s.name='Tamil Nadu';

-- Chhattisgarh — Raipur Province
insert into dioceses (name, state_id)
select 'Archdiocese of Raipur', s.id from states s where s.name='Chhattisgarh';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Ambikapur'),
 ('Diocese of Jashpur'),
 ('Diocese of Raigarh')
) as v(x), states s where s.name='Chhattisgarh';

-- Jharkhand — Ranchi Province
insert into dioceses (name, state_id)
select 'Archdiocese of Ranchi', s.id from states s where s.name='Jharkhand';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Daltonganj'),
 ('Diocese of Dumka'),
 ('Diocese of Gumla'),
 ('Diocese of Hazaribag'),
 ('Diocese of Jamshedpur'),
 ('Diocese of Khunti'),
 ('Diocese of Port Blair'),
 ('Diocese of Simdega')
) as v(x), states s where s.name in ('Jharkhand', 'Andaman and Nicobar Islands');

-- Meghalaya, Mizoram — Shillong Province
insert into dioceses (name, state_id)
select 'Archdiocese of Shillong', s.id from states s where s.name='Meghalaya';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Agartala'),
 ('Diocese of Aizawl'),
 ('Diocese of Jowai'),
 ('Diocese of Nongstoin'),
 ('Diocese of Tura')
) as v(x), states s where s.name in ('Meghalaya','Tripura','Mizoram');

-- Bihar — Patna Province
insert into dioceses (name, state_id)
select 'Archdiocese of Patna', s.id from states s where s.name='Bihar';
insert into dioceses (name, state_id) select x, s.id from (values
 ('Diocese of Bettiah'),
 ('Diocese of Bhagalpur'),
 ('Diocese of Buxar'),
 ('Diocese of Muzaffarpur'),
 ('Diocese of Purnea')
) as v(x), states s where s.name='Bihar';
