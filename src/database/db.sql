CREATE DATABASE boatmate

CREATE TABLE roles(
    id_role serial primary key,
    description_role varchar(15)
);

CREATE TABLE people(
	id_person serial primary key,
	name varchar(30),
	lastname varchar(30),
	mail varchar(50),
	phone varchar(30),
	id_profile serial,
);

CREATE TABLE profiles(
	id_profile serial primary key,
	username varchar(20),
	password varchar(255),
	state boolean,
	id_role serial,
	foreign key (id_role) references role(id_role)
);

CREATE TABLE provider(
	id_provider serial primary key,
	image bytea,
	name varchar(30),
	mail varchar(50),
	phone varchar(30),
	postal varchar(50),
	description text,
	schedule varchar(30),
	position point,
	id_profile serial,
	foreign key (id_profile) references profile(id_profile)
);

CREATE TABLE customer(
	id_customer serial primary key,
	image bytea,
	name varchar(30),
	lastname varchar(30),
	mail varchar(50),
	phone varchar(30),
	position point,
	service text,
	id_profile serial,
	foreign key (id_profile) references profile(id_profile)
);

CREATE TABLE boat(
	id_boat serial primary key,
	type varchar(30),
	model varchar(30),
	brand varchar(30),
	brand_motor varchar(30),
	model_motor varchar(30),
	year numeric,
	length varchar(10),
	position point,
	id_customer serial,
	foreign key (id_customer) references customer(id_customer)
);

CREATE TABLE service(
	id_service serial primary key,
	detail text,
	type varchar(30),
	cost numeric,
	id_provider serial,
	foreign key (id_provider) references provider(id_provider)
);


/*credencials of flyctl*/
Username:    postgres
Password:    y3VCaHm90HSsN1x
Hostname:    boatmatepostgres.internal
Flycast:     fdaa:1:c9d7:0:1::2
Proxy port:  5432
Postgres port:  5433
Connection string: postgres://postgres:y3VCaHm90HSsN1x@boatmatepostgres.flycast:5432


/*database URL*/
DATABASE_URL=postgres://boatmate:5hP5e6O2oIoiGzH@boatmatepostgres.flycast:5432/boatmate?sslmode=disable


/* Datos para rellenar */

--Roles
INSERT INTO roles(role_description) VALUES ('ADMIN');
INSERT INTO roles(role_description) VALUES ('SUPERADMIN');
INSERT INTO roles(role_description) VALUES ('PROVIDER');
INSERT INTO roles(role_description) VALUES ('CUSTOMER');

--People
INSERT INTO people(person_name, lastname, phone, person_image) VALUES ('Chris', 'Cooper', '63792382', 'https://primefaces.org/cdn/primereact/images/avatar/ivanmagalhaes.png');
INSERT INTO people(person_name, lastname, phone, person_image) VALUES ('Martha', 'Jackson', '63792382', null);
INSERT INTO people(person_name, lastname, phone, person_image) VALUES ('Juan', 'Perez', '63792382', 'https://primefaces.org/cdn/primereact/images/avatar/elwinsharvill.png');
INSERT INTO people(person_name, lastname, phone, person_image) VALUES ('Ana', 'Rojas', '63792382', 'https://primefaces.org/cdn/primereact/images/avatar/annafali.png');

--Categories
INSERT INTO categories(category_name) VALUES ('Maintenance & Repair');
INSERT INTO categories(category_name) VALUES ('Electronics');
INSERT INTO categories(category_name) VALUES ('Boat Detailing');
INSERT INTO categories(category_name) VALUES ('Hull Cleaning');
INSERT INTO categories(category_name) VALUES ('Bottom Painting');
INSERT INTO categories(category_name) VALUES ('Sound & Entertainment');

--Services
INSERT INTO services(service_name, service_description) VALUES ('Hull Cleaning', 'boats');
INSERT INTO services(service_name, service_description) VALUES ('Fiberglass Repair', 'jetskis');
INSERT INTO services(service_name, service_description) VALUES ('Seat Repair', 'jetskis');
INSERT INTO services(service_name, service_description) VALUES ('Paint Job', 'jetskis');
INSERT INTO services(service_name, service_description) VALUES ('Propellers', 'boats');
INSERT INTO services(service_name, service_description) VALUES ('Entertainment', 'boats');

--Profiles
INSERT INTO profiles(email, password, profile_state, google, "roleId", "personId") VALUES ('chris@gmail.com', '$2a$12$UTV6djqkgNkcBsuJFmrK/OtsUstoiHFZH5gEBnRhKuwg.p/x3F1qS', true, false, 2, 1);
INSERT INTO profiles(email, password, profile_state, google, "roleId", "personId") VALUES ('martha@gmail.com', '$2a$12$UTV6djqkgNkcBsuJFmrK/OtsUstoiHFZH5gEBnRhKuwg.p/x3F1qS', true, false, 1, 2);
INSERT INTO profiles(email, password, profile_state, google, "roleId", "personId") VALUES ('juan@gmail.com', '123456', true, false, 4, 3);
INSERT INTO profiles(email, password, profile_state, google, "roleId", "personId") VALUES ('ana@gmail.com', '123456', false, false, 3, 4);

--Customers
INSERT INTO customers(customer_lat, customer_lng, "profileId") VALUES ('-17.75157101539973', '-63.185461568261296', 3);

--Boats
INSERT INTO boats(type, model, brand, brand_motor, model_motor, year, length, boat_lat, boat_lng, "customerId") VALUES ('Fishing', 'Model1', 'Alerion', 'Model1', 'Model1', 2015, '5', '-17.75157101539973', '-63.185461568261296', 1);
INSERT INTO boats(type, model, brand, brand_motor, model_motor, year, length, boat_lat, boat_lng, "customerId") VALUES ('Barge', 'Model2', 'Aquila', 'Model2', 'Model2', 2015, '5', '-17.75157101539973', '-63.185461568261296', 1);
INSERT INTO boats(type, model, brand, brand_motor, model_motor, year, length, boat_lat, boat_lng, "customerId") VALUES ('Yach', 'Model3', 'Catalina', 'Model3', 'Model3', 2015, '5', '-17.75157101539973', '-63.185461568261296', 1);

--Providers
INSERT INTO providers(provider_name, provider_image, zip, provider_description, provider_lat, provider_lng, "profileId") VALUES ('boat_bussiness', 'https://i.postimg.cc/05MJFs4y/logo-no-background.png', '1234', 'description', '-17.75157101539973', '-63.185461568261296', 4);

--Schedules
INSERT INTO schedules(start_hour, end_hour, "providerId") VALUES ('08:00', '12:00', 1);
INSERT INTO schedules(start_hour, end_hour, "providerId") VALUES ('14:00', '18:00', 1);

--Portofolios
INSERT INTO portofolios(portofolio_image, portofolio_description, "providerId") VALUES ('https://i.postimg.cc/dtRVYfdj/benjamin-grull-t-Z78-Ef-WSW8-Q-unsplash.jpg', 'description', 1);

--ServiceProvider
INSERT INTO service_providers("serviceIdService", "providerIdProvider", price) VALUES (1, 1, 155.90);
INSERT INTO service_providers("serviceIdService", "providerIdProvider", price) VALUES (3, 1, 290.10);
INSERT INTO service_providers("serviceIdService", "providerIdProvider", price) VALUES (6, 1, 399.90);

--Ratings
INSERT INTO ratings(rating, review, "serviceProviderId", "customerId") VALUES (5, 'The best service', 1, 1);
INSERT INTO ratings(rating, review, "serviceProviderId", "customerId") VALUES (2, 'Not very good service', 2, 1);
INSERT INTO ratings(rating, review, "serviceProviderId", "customerId") VALUES (3, 'Not very good service', 3, 1);

--Contracts
INSERT INTO contracts("serviceProviderIdServiceProvider", "customerIdCustomer", date, contract_state, contract_description) VALUES (1, 1, '2023-04-25', 'APPROVED', 'description 1');
INSERT INTO contracts("serviceProviderIdServiceProvider", "customerIdCustomer", date, contract_state, contract_description) VALUES (2, 1, '2023-04-13', 'APPROVED', 'description 2');
INSERT INTO contracts("serviceProviderIdServiceProvider", "customerIdCustomer", date, contract_state, contract_description) VALUES (3, 1, '2023-04-02', 'APPROVED', 'description 3');

--ServiceCategories
INSERT INTO service_categories("serviceId", "categoryId") VALUES (1, 4);
INSERT INTO service_categories("serviceId", "categoryId") VALUES (2, 1);
INSERT INTO service_categories("serviceId", "categoryId") VALUES (3, 1);
INSERT INTO service_categories("serviceId", "categoryId") VALUES (4, 5);
INSERT INTO service_categories("serviceId", "categoryId") VALUES (5, 3);
INSERT INTO service_categories("serviceId", "categoryId") VALUES (6, 6);

--ServicePreferences
INSERT INTO service_preferences("serviceId", "customerId") VALUES (1, 1);
INSERT INTO service_preferences("serviceId", "customerId") VALUES (3, 1);
INSERT INTO service_preferences("serviceId", "customerId") VALUES (5, 1);