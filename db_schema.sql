CREATE TABLE server_types(
    id serial PRIMARY KEY,
    price_per_minute SMALLINT NOT NULL,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE servers(
    id serial PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    ip VARCHAR(15) NOT NULL,
    is_running BOOLEAN DEFAULT TRUE,
    active BOOLEAN DEFAULT TRUE,
    server_type_id INT NOT NULL,
     FOREIGN KEY (server_type_id)
      REFERENCES server_types (id)
);

CREATE TABLE server_running_times(
    id serial PRIMARY KEY,
    start_datetime TIMESTAMP DEFAULT NOW(),
    end_datetime TIMESTAMP,
    server_id INT NOT NULL,
     FOREIGN KEY (server_id)
      REFERENCES servers (id)
);

INSERT INTO server_types(price_per_minute,name) VALUES(1,'t1.micro'),(2,'t1.nano'),(3,'t1.xl'),(5,'t2.xxl');

