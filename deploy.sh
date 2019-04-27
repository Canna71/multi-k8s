docker build -t gcannata/multi-client:latest -t gcannata/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t gcannata/multi-server:latest -t gcannata/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t gcannata/multi-worker:latest -t gcannata/multi-worker:$SHA -f ./worker/Dockerfile ./worker
docker push gcannata/multi-client:latest 
docker push gcannata/multi-server:latest 
docker push gcannata/multi-worker:latest 

docker push gcannata/multi-client:$SHA 
docker push gcannata/multi-server:$SHA 
docker push gcannata/multi-worker:$SHA 

kubectl apply -f k8s
kubectl set image deployments/client-deployment client=gcannata/multi-client:$SHA 
kubectl set image deployments/server-deployment server=gcannata/multi-server:$SHA 
kubectl set image deployments/worker-deployment worker=gcannata/multi-worker:$SHA 

