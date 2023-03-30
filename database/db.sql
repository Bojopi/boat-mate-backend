CREATE DATABASE boatmate

CREATE TABLE role(
    id_role serial primary key,
    description_role varchar(15)
);

CREATE TABLE profile(
	id_profile serial primary key,
	username varchar(20),
	password varchar(255),
	state boolean,
	id_role serial,
	foreign key (id_role) references role(id_role)
);

CREATE TABLE person(
	id_person serial primary key,
	name varchar(30),
	lastname varchar(30),
	mail varchar(50),
	phone varchar(30),
	id_profile serial,
	foreign key (id_profile) references profile(id_profile)
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