import { Chip } from "@mui/material";
import Iconify from "components/iconify";
import ProductListTable from "sections/@dashboard/management/content/product/component/ProductListTable";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "components/accordion";
import { useContent } from "sections/@dashboard/management/content/hook/useContent";
import { useEffect, useState } from "react";
import { APPWRITE_API } from "config-global";

export default function MockTestProduct({ productList }) {
  const { addSearchList } = useContent();
  const [searchId] = useState(crypto.randomUUID());

  useEffect(() => {
    const save = async () => {
      await addSearchList(
        searchId,
        productList,
        productList?.length,
        APPWRITE_API.collections.products,
        null
      );
    };
    save().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Accordion>
      <AccordionSummary>
        <Chip
          label={"Products (" + productList?.length + ")"}
          color="success"
          icon={<Iconify icon="fluent-emoji:money-bag" />}
        />
      </AccordionSummary>

      <AccordionDetails>
        <ProductListTable data={productList} searchId={searchId} />
      </AccordionDetails>
    </Accordion>
  );
}
