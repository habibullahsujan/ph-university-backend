export const generateCourseMarkAndGrade = (totalMarks: number) => {
  let gradeInfo = {
    grade: '',
    gradePoints: 0,
  };

  if (totalMarks > 0 && totalMarks < 19) {
    gradeInfo.grade = 'F';
    gradeInfo.gradePoints = 0;
  } else if (totalMarks >= 20 && totalMarks <= 39) {
    gradeInfo.grade = 'D';
    gradeInfo.gradePoints = 3;
  } else if (totalMarks >= 39 && totalMarks <= 59) {
    gradeInfo.grade = 'C';
    gradeInfo.gradePoints = 3;
  } else if (totalMarks >= 60 && totalMarks <= 79) {
    gradeInfo.grade = 'B';
    gradeInfo.gradePoints = 4;
  } else if (totalMarks >= 80 && totalMarks <= 100) {
    gradeInfo.grade = 'A';
    gradeInfo.gradePoints = 5;
  } else {
    gradeInfo = {
      grade: '',
      gradePoints: 0,
    };
  }
  return gradeInfo;
};
