docker build --no-cache -t untadee/comment-survey-fe-6 ./fe
docker push untadee/comment-survey-fe-6:latest


docker build --no-cache -t untadee/comment-survey-be-6 ./be
docker push untadee/comment-survey-be-6:latest
