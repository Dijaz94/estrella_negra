-- AlterTable
ALTER TABLE "evento" ALTER COLUMN "afiche_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "negocio" ALTER COLUMN "logo_url" DROP NOT NULL,
ALTER COLUMN "banner_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "producto" ALTER COLUMN "imagen_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "red_social" ALTER COLUMN "red_url" DROP NOT NULL;
