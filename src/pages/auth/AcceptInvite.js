import { useSearchParams, Navigate } from "react-router-dom";
import { account, databases, teams } from "../../auth/AppwriteContext";
import { useEffect, useState } from "react";
import { PATH_PAGE } from "../../routes/paths";
import LoadingScreen from "../../components/loading-screen/LoadingScreen";
import { APPWRITE_API } from "../../config-global";
import { Query } from "appwrite";
import { useAuthContext } from "../../auth/useAuthContext";

export default function AcceptInvite() {
	const [searchParams] = useSearchParams();
	const membershipId = searchParams.get("membershipId");
	const userId = searchParams.get("userId");
	const secret = searchParams.get("secret");
	const teamId = searchParams.get("teamId");

	const { sarthakInfoData } = useAuthContext();

	const [status, setStatus] = useState(0)

	useEffect(() => {
		const fetchData = async () => {
			try {
				await account.deleteSessions();
				await teams.updateMembershipStatus(teamId, membershipId, userId, secret)

				if (sarthakInfoData?.adminTeamId === teamId) {
					const totalUser = (await databases.listDocuments(
						APPWRITE_API.databaseId,
						APPWRITE_API.collections.adminUsers,
						[
							Query.limit(1),
							Query.offset(1),
						]
					)).total + 1;
					var currentEmpId = 'EMP';
					if (totalUser.toString().length === 1) {
						currentEmpId += '000' + totalUser.toString();
					} else if (totalUser.toString().length === 2) {
						currentEmpId += '00' + totalUser.toString();
					} else if (totalUser.toString().length === 3) {
						currentEmpId += '0' + totalUser.toString();
					} else if (totalUser.toString().length === 4) {
						currentEmpId += totalUser.toString();
					}

					const user = await account.get();

					await databases.createDocument(
						APPWRITE_API.databaseId,
						APPWRITE_API.collections.adminUsers,
						userId,
						{
							name: user.name,
							email: user.email,
							phoneNumber: user.phone,
							empId: currentEmpId,
						}
					)
				}
				setStatus(1);
			} catch (error) {
				setStatus(-1);
			}
		}
		fetchData();
	}, [membershipId, userId, secret, teamId])

	if (status === 0) {
		return <LoadingScreen />
	} else if (status === 1) {
		return <Navigate to={PATH_PAGE.success} />
	} else {
		return <Navigate to={PATH_PAGE.page410} />
	}
}