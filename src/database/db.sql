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
INSERT INTO roles(description_role) VALUES ('ADMIN');
INSERT INTO roles(description_role) VALUES ('SUPERADMIN');
INSERT INTO roles(description_role) VALUES ('PROVIDER');
INSERT INTO roles(description_role) VALUES ('CUSTOMER');

--People
INSERT INTO people(name, lastname, phone) VALUES ('Chris', 'Cooper', '63792382');
INSERT INTO people(name, lastname, phone) VALUES ('Martha', 'Jackson', '63792382');
INSERT INTO people(name, lastname, phone) VALUES ('Juan', 'Perez', '63792382');
INSERT INTO people(name, lastname, phone) VALUES ('Ana', 'Rojas', '63792382');

--Profiles
INSERT INTO profiles(email, password, state, "roleId", "personId") VALUES ('chris@gmail.com', '$2a$12$UTV6djqkgNkcBsuJFmrK/OtsUstoiHFZH5gEBnRhKuwg.p/x3F1qS', true, 2, 1);
INSERT INTO profiles(email, password, state, "roleId", "personId") VALUES ('martha@gmail.com', '$2a$12$UTV6djqkgNkcBsuJFmrK/OtsUstoiHFZH5gEBnRhKuwg.p/x3F1qS', true, 1, 2);
INSERT INTO profiles(email, password, state, "roleId", "personId") VALUES ('juan@gmail.com', '123456', true, 4, 3);
INSERT INTO profiles(email, password, state, "roleId", "personId") VALUES ('ana@gmail.com', '123456', true, 3, 4);

--Customers
INSERT INTO customers(image, position, service, "profileId") VALUES ('https://i.postimg.cc/dtRVYfdj/benjamin-grull-t-Z78-Ef-WSW8-Q-unsplash.jpg', '(1, 1)', 'Servicio 1', 3);
INSERT INTO customers(image, position, service, "profileId") VALUES ('https://i.postimg.cc/dtRVYfdj/benjamin-grull-t-Z78-Ef-WSW8-Q-unsplash.jpg', '(1, 1)', 'Servicio 2', 4);

--Providers
INSERT INTO providers(image, postal, description, position, "profileId") VALUES ('https://i.postimg.cc/dtRVYfdj/benjamin-grull-t-Z78-Ef-WSW8-Q-unsplash.jpg', '1234', 'description', '(1, 1)', 2);

--Boats
INSERT INTO boats(type, model, brand, brand_motor, model_motor, year, length, position, "customerId") VALUES ('Fishing', 'Model1', 'Alerion', 'Model1', 'Model1', 2015, '5', '(1, 1)', 1);
INSERT INTO boats(type, model, brand, brand_motor, model_motor, year, length, position, "customerId") VALUES ('Barge', 'Model2', 'Aquila', 'Model2', 'Model2', 2015, '5', '(1, 1)', 2);
INSERT INTO boats(type, model, brand, brand_motor, model_motor, year, length, position, "customerId") VALUES ('Yach', 'Model3', 'Catalina', 'Model3', 'Model3', 2015, '5', '(1, 1)', 1);

--Schedules
INSERT INTO schedules(start_hour, end_hour, "providerId") VALUES ('08:00', '12:00', 1);
INSERT INTO schedules(start_hour, end_hour, "providerId") VALUES ('14:00', '18:00', 1);


--Services
INSERT INTO services(detail, type, cost, "providerId") VALUES ('detail service 1', 'type 1', 190.30, 1);
INSERT INTO services(detail, type, cost, "providerId") VALUES ('detail service 2', 'type 2', 234.89, 1);
INSERT INTO services(detail, type, cost, "providerId") VALUES ('detail service 3', 'type 3', 38.12, 1);
INSERT INTO services(detail, type, cost, "providerId") VALUES ('detail service 4', 'type 4', 2000.50, 1);

--Categories
INSERT INTO categories(name) VALUES ('category 1');
INSERT INTO categories(name) VALUES ('category 2');
INSERT INTO categories(name) VALUES ('category 3');

--Service Categories
INSERT INTO service_categories("serviceId", "categoryId") VALUES (1, 1);
INSERT INTO service_categories("serviceId", "categoryId") VALUES (2, 2);
INSERT INTO service_categories("serviceId", "categoryId") VALUES (1, 3);
INSERT INTO service_categories("serviceId", "categoryId") VALUES (3, 1);