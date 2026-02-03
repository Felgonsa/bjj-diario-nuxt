CREATE TYPE "public"."faixa" AS ENUM('branca', 'cinza', 'amarela', 'laranja', 'verde', 'azul', 'roxa', 'marrom', 'preta');--> statement-breakpoint
CREATE TYPE "public"."resultado_rola" AS ENUM('finalizei', 'fui_finalizado', 'empate');--> statement-breakpoint
CREATE TYPE "public"."sentimento" AS ENUM('cansado', 'forte', 'destruido', 'tecnico', 'normal');--> statement-breakpoint
CREATE TYPE "public"."tipo_treino" AS ENUM('com_kimono', 'sem_kimono', 'drills', 'open_mat');--> statement-breakpoint
CREATE TABLE "faixas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"categoria" text,
	"cor_hex" text NOT NULL,
	"ordem" integer NOT NULL,
	CONSTRAINT "faixas_nome_unique" UNIQUE("nome"),
	CONSTRAINT "faixas_ordem_unique" UNIQUE("ordem")
);
--> statement-breakpoint
CREATE TABLE "rolas" (
	"id" serial PRIMARY KEY NOT NULL,
	"treino_id" integer NOT NULL,
	"nome_parceiro" text NOT NULL,
	"graduacao_parceiro" "faixa" NOT NULL,
	"resultado" "resultado_rola" NOT NULL,
	"forma_finalizacao" text,
	"notas" text,
	"duracao" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "treinos" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer NOT NULL,
	"data" timestamp NOT NULL,
	"duracao" integer NOT NULL,
	"tipo" "tipo_treino" NOT NULL,
	"professor" text,
	"tecnicas_aprendidas" text,
	"sentimento" "sentimento",
	"observacoes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"senha" text NOT NULL,
	"faixa" "faixa" DEFAULT 'branca' NOT NULL,
	"graus" integer DEFAULT 0 NOT NULL,
	"equipe" text,
	"peso_atual" real,
	"data_cadastro" timestamp DEFAULT now() NOT NULL,
	"data_atualizacao" timestamp DEFAULT now() NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "rolas" ADD CONSTRAINT "rolas_treino_id_treinos_id_fk" FOREIGN KEY ("treino_id") REFERENCES "public"."treinos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treinos" ADD CONSTRAINT "treinos_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;