CreateMiniPlots <- function(views, saveToFolder)
{
  for (i in seq_along(views))
  {
    view <- views[[i]]
    fileName <- sprintf("%s/%03d.png",saveToFolder,i)
    require("png")
    png(fileName)
    par(mar=c(0,0,0,0))
    plot(view,xlab="",ylab="",xaxt='n',yaxt='n',cex=1,pch=19)
    dev.off()
  }
}

ConvertMatrixToList <- function(m)
{
  l <- list()
  for (i in 1:nrow(m))
  {
    l[[i]] <- m[i,]
  }
  return(l)
}

ConvertListToMatrix <- function(l)
{
  return(do.call(rbind,l))
}

writeToJson <- function(object, fileName)
{
  require("rjson")
  write(toJSON(object),file=fileName)
}

Normalize <- function(m)
{
  min.x <- min(m[,1])
  max.x <- max(m[,1])
  min.y <- min(m[,2])
  max.y <- max(m[,2])
  m.normalized <- m
  m.normalized[,1] <- (m[,1]-min.x)/(max.x-min.x)
  m.normalized[,2] <- (m[,2]-min.y)/(max.y-min.y)
  return(m.normalized)
}
