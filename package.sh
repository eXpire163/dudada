echo "Building Vue.js application"
cd client
npm install
npm run build
cd ..


echo Build express backend
npm install
npm run build


echo Move frontend build to backend
mkdir -p dist/client
cp -R client/dist/* dist/client
cp users.json dist/users.json
