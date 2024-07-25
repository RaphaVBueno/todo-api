/*
  Warnings:

  - You are about to drop the column `descricription` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "descricription",
ADD COLUMN     "description" TEXT;
