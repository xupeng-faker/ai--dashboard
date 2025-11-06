#!/bin/bash

# Docker 镜像构建和上传脚本
# 使用方法: ./build-and-push.sh [dockerhub-username]

set -e

DOCKERHUB_USERNAME=${1:-"xupeng-faker"}
IMAGE_NAME="ai-dashboard"
VERSION="latest"
FULL_IMAGE_NAME="${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${VERSION}"

echo "🚀 开始构建 Docker 镜像..."
docker build -t ${IMAGE_NAME}:${VERSION} .

echo "✅ 镜像构建完成"
echo "📦 镜像名称: ${IMAGE_NAME}:${VERSION}"

echo "🏷️  为镜像打标签..."
docker tag ${IMAGE_NAME}:${VERSION} ${FULL_IMAGE_NAME}

echo "🔐 请登录 Docker Hub..."
docker login

echo "📤 推送镜像到 Docker Hub..."
docker push ${FULL_IMAGE_NAME}

echo "✅ 镜像已成功上传到 Docker Hub!"
echo "📍 镜像地址: https://hub.docker.com/r/${DOCKERHUB_USERNAME}/${IMAGE_NAME}"
echo ""
echo "使用以下命令拉取镜像:"
echo "docker pull ${FULL_IMAGE_NAME}"

