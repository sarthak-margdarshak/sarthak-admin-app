import { Chip, Grid, Stack, Tooltip, Typography } from "@mui/material";
import Iconify from "components/iconify";
import IndexView from "sections/@dashboard/management/content/common/IndexView";
import { timeAgo } from "auth/AppwriteContext";
import { Fragment } from "react";
import { Item } from "components/item/Item";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "components/accordion";

export default function MockTestMetadata({ mockTest }) {
  return (
    <Accordion>
      <AccordionSummary>
        <Chip
          label="Metadata"
          color="success"
          icon={<Iconify icon="fluent-color:calendar-data-bar-16" />}
        />
      </AccordionSummary>

      <AccordionDetails>
        <Grid container sx={{ mt: 2 }} spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Index →</Typography>
                <IndexView id={mockTest?.bookIndex?.$id} />
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">System Generated Id →</Typography>
                <Typography variant="body2">{mockTest?.$id}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Duration →</Typography>
                <Typography variant="body2">{`${mockTest?.duration} minutes`}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Level →</Typography>
                <Typography variant="body2">{mockTest?.level}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Sarthak Id →</Typography>
                <Typography variant="body2">{mockTest?.mtId}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Status →</Typography>
                <Typography variant="body2">
                  {mockTest?.published ? "Published" : "Draft"}
                </Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Created By →</Typography>
                <Typography variant="body2">{mockTest?.creator}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Created At →</Typography>
                <Tooltip title={mockTest?.$createdAt}>
                  <Typography variant="body2">
                    {timeAgo.format(
                      Date.parse(
                        mockTest?.$createdAt || "2000-01-01T00:00:00.000+00:00"
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
                <Typography variant="body2">{mockTest?.updater}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Updated At →</Typography>
                <Tooltip title={mockTest?.$updatedAt}>
                  <Typography variant="body2">
                    {timeAgo.format(
                      Date.parse(
                        mockTest?.$updatedAt || "2000-01-01T00:00:00.000+00:00"
                      )
                    )}
                  </Typography>
                </Tooltip>
              </Stack>
            </Item>
          </Grid>

          {mockTest?.published && (
            <Fragment>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Item>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="body1">Approved By →</Typography>
                    <Typography variant="body2">
                      {mockTest?.approver}
                    </Typography>
                  </Stack>
                </Item>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Item>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="body1">Approved At →</Typography>
                    <Tooltip title={mockTest?.approvedAt}>
                      <Typography variant="body2">
                        {timeAgo.format(
                          Date.parse(
                            mockTest?.approvedAt ||
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
