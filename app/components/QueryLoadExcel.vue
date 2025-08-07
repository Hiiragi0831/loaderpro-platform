<script setup lang="ts">
import type { FileUploadUploaderEvent } from "primevue/fileupload";
import { useToast } from "primevue/usetoast";
import readXlsxFile from "read-excel-file";

interface ExcelRow {
  brand: string;
  num_parts: string;
  count: number;
  [key: string]: string | number;
}

const toast = useToast();
const queryStore = useQueryStore();
const brandStore = useBrandStore();

const upLoader = async (event: FileUploadUploaderEvent) => {
  let file: File | undefined;
  const brands = brandStore.brand.map((b) => b.name); // список брендов с сервера

  if (Array.isArray(event.files)) {
    file = event.files[0];
  } else {
    file = event.files;
  }

  if (!file) return;

  const map = {
    Бренд: "brand",
    "Номер запчасти": "num_parts",
    Количество: "count",
  };

  readXlsxFile(file, { map }).then((data) => {
    const rows = (data.rows as ExcelRow[]).map((row) => {
      const matchedBrand = brands.find(
        (b) =>
          String(row.brand).toLowerCase().includes(b.toLowerCase()) ||
          b.toLowerCase().includes(String(row.brand).toLowerCase()),
      );
      return {
        ...row,
        brand: matchedBrand || row.brand,
      };
    });
    const rowsWithId = rows.map((row: ExcelRow) => ({
      id: Math.round(Date.now() + Math.random()),
      ...row,
    }));
    queryStore.add(rowsWithId);
    toast.add({
      severity: "success",
      summary: "Файл загружен",
      detail: "Данные успешно обработаны",
      life: 3000,
    });
  });
};

const handleDownload = () =>
  downloadTemplate(
    "/templates/loaderpro_query_template.xlsx",
    "loaderpro_query_template.xlsx",
  );
</script>

<template>
  <div class="card flex justify-center gap-15">
    <Button label="Скачать шаблон" variant="text" @click="handleDownload" />
    <FileUpload
      :custom-upload="true"
      :auto="true"
      mode="basic"
      name="file"
      accept=".xlsx"
      :max-file-size="1000000"
      choose-label="Загрузить файл"
      class="p-button-outlined"
      @uploader="upLoader"
    />
  </div>
</template>

<style scoped></style>
