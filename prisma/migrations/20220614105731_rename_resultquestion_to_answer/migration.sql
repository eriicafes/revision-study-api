/*
  Warnings:

  - You are about to drop the `ResultQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ResultQuestion" DROP CONSTRAINT "ResultQuestion_questionId_fkey";

-- DropForeignKey
ALTER TABLE "ResultQuestion" DROP CONSTRAINT "ResultQuestion_resultId_fkey";

-- DropTable
DROP TABLE "ResultQuestion";

-- CreateTable
CREATE TABLE "Answer" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questionId" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("questionId","resultId")
);

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
