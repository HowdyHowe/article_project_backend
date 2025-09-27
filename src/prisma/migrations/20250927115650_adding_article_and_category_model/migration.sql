-- CreateTable
CREATE TABLE "public"."Article" (
    "article_id" VARCHAR(10) NOT NULL,
    "title" VARCHAR(99) NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category_id" VARCHAR(10) NOT NULL,

    CONSTRAINT "article_id_prikey" PRIMARY KEY ("article_id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "category_id" VARCHAR(10) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_id_prikey" PRIMARY KEY ("category_id")
);

-- AddForeignKey
ALTER TABLE "public"."Article" ADD CONSTRAINT "Article_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Article" ADD CONSTRAINT "Article_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;
