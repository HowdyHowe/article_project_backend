-- CreateTable
CREATE TABLE "public"."User" (
    "user_id" CHAR(10) NOT NULL,
    "username" CHAR(99),
    "password" CHAR(99),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_id_prikey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "username_unique" ON "public"."User"("username");
