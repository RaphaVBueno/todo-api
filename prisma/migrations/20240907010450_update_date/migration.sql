/*
  Warnings:

  - You are about to drop the column `date` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "date",
ADD COLUMN     "completedDate" DATE,
ADD COLUMN     "dueDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP;
