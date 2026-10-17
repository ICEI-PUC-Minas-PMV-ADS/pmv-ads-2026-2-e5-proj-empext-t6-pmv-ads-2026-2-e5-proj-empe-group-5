-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TECNICO');

-- CreateEnum
CREATE TYPE "StatusOS" AS ENUM ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoManutencao" AS ENUM ('PREVENTIVA', 'CORRETIVA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'TECNICO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cnpjCpf" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "capacidadeBtu" INTEGER NOT NULL,
    "clienteId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdemServico" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" "TipoManutencao" NOT NULL DEFAULT 'PREVENTIVA',
    "status" "StatusOS" NOT NULL DEFAULT 'PENDENTE',
    "dataAgendada" TIMESTAMP(3) NOT NULL,
    "concluidoEm" TIMESTAMP(3),
    "clienteId" TEXT NOT NULL,
    "equipamentoId" TEXT NOT NULL,
    "tecnicoId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrdemServico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cnpjCpf_key" ON "Cliente"("cnpjCpf");

-- AddForeignKey
ALTER TABLE "Equipamento" ADD CONSTRAINT "Equipamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "Equipamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
