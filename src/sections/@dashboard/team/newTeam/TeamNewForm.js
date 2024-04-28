/**
 * Written By - Ritesh Ranjan
 * Website - https://sagittariusk2.github.io/
 * 
 *  /|||||\    /|||||\   |||||||\   |||||||||  |||   |||   /|||||\   ||| ///
 * |||        |||   |||  |||   |||     |||     |||   |||  |||   |||  |||///
 *  \|||||\   |||||||||  |||||||/      |||     |||||||||  |||||||||  |||||
 *       |||  |||   |||  |||  \\\      |||     |||   |||  |||   |||  |||\\\
 *  \|||||/   |||   |||  |||   \\\     |||     |||   |||  |||   |||  ||| \\\
 * 
 */

// IMPORT ---------------------------------------------------------------

import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, CardContent, Grid, Skeleton, Stack, TextField, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
// Auth
import { Team } from '../../../../auth/Team';
import { useAuthContext } from '../../../../auth/useAuthContext';
import { Upload } from '../../../../components/upload';

// ----------------------------------------------------------------------

TeamNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentTeam: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function TeamNewForm({ teamId }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const [name, setName] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      var tempData = null;
      if (teamId) {
        tempData = await Team.getTeamData(teamId);
      }
      setName(tempData?.name);
      if (tempData?.cover) {
        const tt = await Team.getTeamCover(tempData?.cover);
        setCoverFile(tt);
      }
      setIsDataLoading(false);
    }
    fetchData();
  }, [teamId])

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (teamId) {
        // Update Name
        await Team.addTeamToDatabase(name, user.$id, teamId);
        // Upload Cover
        if (coverFile && typeof(coverFile)!=='string') {
          await Team.uploadTeamCover(coverFile, teamId, user.$id, true);
        } else {
          await Team.uploadTeamCover(coverFile, teamId, user.$id, false);
        }
        // TODO : Update Owner
        enqueueSnackbar(!teamId ? 'Your Team is updated successfully!!!' : 'Update success!');
      navigate(PATH_DASHBOARD.team.view(teamId));
      } else {
        // Create Team
        const newTeam = await Team.addTeamToDatabase(name, user.$id, null);
        // Upload Cover of the team if present
        if (coverFile) {
          await Team.uploadTeamCover(coverFile, newTeam.$id, user.$id, true);
        }
        // Add membership of owner as owner
        await Team.addMemberToTeamDatabase(newTeam.$id, user.$id, user.$id, "owner", true, true);
        enqueueSnackbar(!teamId ? 'Your Team is created successfully!!!' : 'Update success!');
      navigate(PATH_DASHBOARD.team.view(newTeam.$id));
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setIsSubmitting(false);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setCoverFile(file);
      }
    },
    []
  );

  if (isDataLoading) {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Skeleton variant="rounded" height={200} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Skeleton variant="rounded" height={70} />
              <Skeleton sx={{ mt: 2 }} variant="rounded" height={50} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Cover
          </Typography>

          <Upload
            accept={{ 'image/*': [] }}
            file={coverFile}
            maxSize={204800}
            onDrop={handleDrop}
            onDelete={() => setCoverFile(null)}
          />
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
          >
            <TextField
              value={name}
              placeholder='Enter Name'
              onChange={(event) => setName(event.target.value)}
              label="Team Name" />

            {/* TODO: Transfer Ownership */}

          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton
              variant="contained"
              loading={isSubmitting}
              onClick={onSubmit}>
              {teamId ? "Update" : "Create Team"}
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
