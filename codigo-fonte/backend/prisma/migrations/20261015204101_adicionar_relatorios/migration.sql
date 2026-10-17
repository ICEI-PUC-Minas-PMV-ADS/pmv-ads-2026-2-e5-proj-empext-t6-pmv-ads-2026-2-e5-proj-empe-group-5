-- CreateTable
CREATE TABLE "relatorios" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataServico" TIMESTAMP(3) NOT NULL,
    "cliente" TEXT NOT NULL,
    "funcionario" TEXT NOT NULL,
    "equipamento" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "relatorios_pkey" PRIMARY KEY ("id")
);
