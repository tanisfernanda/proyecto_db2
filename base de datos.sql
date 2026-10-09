create database if not exists tienda;
use tienda;

create table if not exists Producto(
id int auto_increment primary key,
nombre varchar(100) not null,
precio decimal (10,2)not null,
stock int not null);

insert into Producto (nombre,precio,stock) values
('Teclado Mecanico RGB',12000.00,15),
('Mouse Gamer Inalambrico',75000.00,20),
('Monitor 24 Pulgadas FHD',450000.00,8);

select*from Producto;