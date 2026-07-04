/*
  Warnings:

  - Changed the type of `horario` on the `negocio` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "negocio" DROP COLUMN "horario",
ADD COLUMN     "horario" JSONB NOT NULL;
