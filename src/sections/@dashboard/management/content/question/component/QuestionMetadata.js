import { Chip, Grid, Stack, Tooltip, Typography } from "@mui/material";
import Iconify from "components/iconify";
import { timeAgo } from "auth/AppwriteContext";
import React, { Fragment } from "react";
import { Item } from "components/item/Item";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "components/accordion";

export default function QuestionMetadata({ question }) {
  return (
    <Accordion>
      <AccordionSummary>
        <Chip
          label="Metadata"
          color="info"
          icon={<Iconify icon="fluent-color:calendar-data-bar-16" />}
        />
      </AccordionSummary>

      <AccordionDetails>
        <Grid container sx={{ mt: 2 }} spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Index →</Typography>
                <Typography variant="body2">
                  {question?.standard?.standard +
                    " 🢒 " +
                    question?.subject?.subject +
                    " 🢒 " +
                    question?.chapter?.chapter +
                    " 🢒 " +
                    question?.concept?.concept}
                </Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">System Generated Id →</Typography>
                <Typography variant="body2">{question?.$id}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Sarthak Id →</Typography>
                <Typography variant="body2">{question["qnId"]}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Status →</Typography>
                <Typography variant="body2">
                  {question?.published ? "Published" : "Draft"}
                </Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Created By →</Typography>
                <Typography variant="body2">{question?.creator}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Created At →</Typography>
                <Tooltip title={question?.$createdAt}>
                  <Typography
                    variant="body2"
                    sx={{
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    {timeAgo.format(
                      Date.parse(
                        question?.$createdAt || "2000-01-01T00:00:00.000+00:00"
                      )
                    )}
                  </Typography>
                </Tooltip>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Updated By →</Typography>
                <Typography variant="body2">{question?.updater}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Updated At →</Typography>
                <Tooltip title={question?.$updatedAt}>
                  <Typography
                    variant="body2"
                    sx={{
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    {timeAgo.format(
                      Date.parse(
                        question?.$updatedAt || "2000-01-01T00:00:00.000+00:00"
                      )
                    )}
                  </Typography>
                </Tooltip>
              </Stack>
            </Item>
          </Grid>

          {question?.published && (
            <Fragment>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Item>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="body1">Approved By →</Typography>
                    <Typography variant="body2">
                      {question["approver"]}
                    </Typography>
                  </Stack>
                </Item>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Item>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="body1">Approved At →</Typography>
                    <Tooltip title={question["approvedAt"]}>
                      <Typography
                        variant="body2"
                        sx={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        {timeAgo.format(
                          Date.parse(
                            question["approvedAt"] ||
                              "2000-01-01T00:00:00.000+00:00"
                          )
                        )}
                      </Typography>
                    </Tooltip>
                  </Stack>
                </Item>
              </Grid>
            </Fragment>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
