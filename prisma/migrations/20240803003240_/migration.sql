-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_userEmail_fkey";

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
