docker build --no-cache -t untadee/comment-survey-fe-5 ./fe
docker push untadee/comment-survey-fe-5:latest


docker build --no-cache -t untadee/comment-survey-be-5 ./be
docker push untadee/comment-survey-be-5:latest
