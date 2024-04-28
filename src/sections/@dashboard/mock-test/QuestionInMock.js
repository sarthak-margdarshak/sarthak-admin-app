import { useEffect, useState } from "react";
import { Question } from "../../../auth/Question";
import { Card, CardContent, CardHeader, Skeleton } from "@mui/material";

export default function QuestionInMock({ sn, questionId }) {

  const [question, setQuestion] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await Question.getQuestion(questionId);
      setQuestion(data);
      setLoading(false)
    }
    fetchData();
  }, [questionId])

  if(loading) {
    return (
      <Card>
        <Skeleton variant="rounded" width={500} height={250} />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title={sn+". "+question?.contentQuestion} />
      <CardContent>
        <div sx={{p:2}}>{"A. "+question?.contentOptionA}</div>
        <div sx={{p:2}}>{"B. "+question?.contentOptionB}</div>
        <div sx={{p:2}}>{"C. "+question?.contentOptionC}</div>
        <div sx={{p:2}}>{"D. "+question?.contentOptionD}</div>
      </CardContent>
    </Card>
  )
}