Power BI / Excel — instruções rápidas

1) Objetivo
- Esta pasta `powerbi/` contém CSVs formatados para importar facilmente no Power BI ou Excel (encodings UTF-8, datas em `YYYY-MM-DD`, separador `,`).

2) Como gerar (local)
```bash
cd back
node scripts/format_for_powerbi.js
```

3) Importar no Power BI Desktop
- Abra Power BI Desktop → `Get Data` → `Text/CSV` e selecione o CSV desejado em `back/exports/powerbi/`.
- Para manter atualização, use `DirectQuery` apontando para o banco Postgres ou agende refresh conectando os CSVs em storage (S3/Drive).

4) Observações
- Nomes de colunas e arquivos estão em português (ex.: `estoque_por_categoria.csv`).
- Se preferir decimal com vírgula, converta no Power BI (Transform → Replace Values) ou ajuste local do Excel.
