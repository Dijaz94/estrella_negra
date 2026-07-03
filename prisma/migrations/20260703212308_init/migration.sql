-- CreateEnum
CREATE TYPE "EstadoEvento" AS ENUM ('PROGRAMADO', 'CANCELADO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'EDITOR');

-- CreateTable
CREATE TABLE "evento" (
    "id_evento" SERIAL NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "artistas" VARCHAR(255),
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE,
    "fecha_hora" TIME NOT NULL,
    "afiche_url" VARCHAR(100) NOT NULL,
    "estado" "EstadoEvento" NOT NULL,
    "capacidad_max" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evento_pkey" PRIMARY KEY ("id_evento")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,
    "correo" VARCHAR(254) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "rol" "Rol" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "orden" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "producto" (
    "id_producto" SERIAL NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "imagen_url" VARCHAR(254) NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "destacado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "producto_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "negocio" (
    "id_configuracion" SERIAL NOT NULL,
    "nombre_local" VARCHAR(50) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "direccion" VARCHAR(50) NOT NULL,
    "horario" VARCHAR(200) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "whatsapp" VARCHAR(20) NOT NULL,
    "correo" VARCHAR(254) NOT NULL,
    "logo_url" VARCHAR(254) NOT NULL,
    "banner_url" VARCHAR(254) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "negocio_pkey" PRIMARY KEY ("id_configuracion")
);

-- CreateTable
CREATE TABLE "red_social" (
    "id_red" SERIAL NOT NULL,
    "nombre" VARCHAR(20) NOT NULL,
    "red_url" VARCHAR(254) NOT NULL,
    "id_configuracion" INTEGER NOT NULL,

    CONSTRAINT "red_social_pkey" PRIMARY KEY ("id_red")
);

-- CreateIndex
CREATE INDEX "evento_fecha_inicio_idx" ON "evento"("fecha_inicio");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- CreateIndex
CREATE INDEX "usuario_id_usuario_idx" ON "usuario"("id_usuario");

-- CreateIndex
CREATE INDEX "categoria_id_categoria_idx" ON "categoria"("id_categoria");

-- CreateIndex
CREATE INDEX "producto_id_categoria_idx" ON "producto"("id_categoria");

-- CreateIndex
CREATE UNIQUE INDEX "negocio_correo_key" ON "negocio"("correo");

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "red_social" ADD CONSTRAINT "red_social_id_configuracion_fkey" FOREIGN KEY ("id_configuracion") REFERENCES "negocio"("id_configuracion") ON DELETE RESTRICT ON UPDATE CASCADE;
