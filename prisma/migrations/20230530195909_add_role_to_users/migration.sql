-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('admin', 'member');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "ROLE" NOT NULL DEFAULT 'member';
